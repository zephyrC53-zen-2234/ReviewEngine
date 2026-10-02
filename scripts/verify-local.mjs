import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createConnection } from 'node:net';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));
mkdirSync('.verification', { recursive: true });
const logFile = '.verification/latest.log';
writeFileSync(logFile, `ReviewEngine verification started ${new Date().toISOString()}\n`);
const services = [];
let stopped = false;
let activeCommand;
function log(value) { const text = String(value); process.stdout.write(text); appendFileSync(logFile, text); }
function launch(command, args) {
  const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
  child.stdout.on('data', log);
  child.stderr.on('data', log);
  return child;
}
async function run(command, args) {
  if (stopped) throw new Error('Verification was stopped.');
  log(`\nRunning ${command} ${args.join(' ')}\n`);
  await new Promise((resolve, reject) => {
    const child = launch(command, args);
    activeCommand = child;
    child.once('error', reject);
    child.once('exit', (code, signal) => { activeCommand = undefined; code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} failed (${signal || code}).`)); });
  });
}
function listening(port, host) {
  return new Promise(resolve => {
    const socket = createConnection({ port, host });
    const finish = result => { socket.destroy(); resolve(result); };
    socket.setTimeout(1000);
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.once('timeout', () => finish(false));
  });
}
async function waitFor(port, host, child) {
  for (let attempt = 0; attempt < 90; attempt++) {
    if (child.exitCode !== null || child.signalCode !== null) throw new Error('A required service stopped. See the preceding log.');
    if (await listening(port, host)) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${host}:${port}.`);
}
function stop() {
  if (stopped) return;
  stopped = true;
  activeCommand?.kill('SIGTERM');
  for (const service of services.reverse()) service.kill('SIGTERM');
}
process.on('SIGINT', () => { stop(); process.exitCode = 130; });
process.on('SIGTERM', () => { stop(); process.exitCode = 143; });

try {
  await run('npm', ['install']);
  await run(process.execPath, ['scripts/setup-env.mjs']);
  await import('dotenv/config');
  const database = new URL(process.env.DATABASE_URL);
  const app = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  if (![database.hostname, app.hostname].every(host => ['localhost', '127.0.0.1'].includes(host))) {
    throw new Error('This helper only operates on local development databases and applications.');
  }
  const dbPort = Number(database.port || 5432);
  const appPort = Number(app.port || 80);
  if (await listening(appPort, app.hostname)) throw new Error(`Port ${appPort} is in use. Stop the existing app first so tests use the newly built version.`);
  if (!(await listening(dbPort, database.hostname))) {
    if (dbPort !== 54329) throw new Error('Start your custom PostgreSQL server first. Automatic startup uses port 54329.');
    const postgres = launch(process.execPath, ['--import', 'tsx', 'scripts/database.ts']);
    services.push(postgres);
    await waitFor(dbPort, database.hostname, postgres);
    // The database startup script creates the application database after binding its port.
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  await run('npm', ['audit', '--audit-level=high']);
  await run('npm', ['run', 'db:deploy']);
  await run(process.execPath, ['node_modules/prisma/build/index.js', 'generate']);
  await run('npm', ['run', 'db:seed']);
  await run('npm', ['test']);
  await run('npm', ['run', 'build']);
  const server = launch(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', app.hostname, '--port', String(appPort)]);
  services.push(server);
  await waitFor(appPort, app.hostname, server);
  await run('npm', ['run', 'test:integration']);
  writeFileSync('.verification/result.json', JSON.stringify({ status: 'passed', finishedAt: new Date().toISOString() }, null, 2));
  log(`\nAll automated checks passed. ReviewEngine is running at ${app.origin}.\nKeep this terminal open for browser testing. Press Control+C to stop services started by this helper.\n`);
} catch (error) {
  log(`\nVERIFICATION STOPPED: ${error.message}\nFull output saved to ${logFile}.\n`);
  writeFileSync('.verification/result.json', JSON.stringify({ status: 'failed', error: error.message, finishedAt: new Date().toISOString() }, null, 2));
  stop();
  process.exitCode = 1;
}
