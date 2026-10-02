import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const directory = resolve('.postgres');
const postgres = new EmbeddedPostgres({ databaseDir: directory, user: 'reviewengine', password: 'reviewengine_local', port: 54329, persistent: true, authMethod: 'scram-sha-256', postgresFlags: ['-h', '127.0.0.1'] });
if (!existsSync(resolve(directory, 'PG_VERSION')))
    await postgres.initialise();
await postgres.start();
const client = postgres.getPgClient();
await client.connect();
const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = 'reviewengine'");
await client.end();
if (!exists.rowCount)
    await postgres.createDatabase('reviewengine');
console.log('Local PostgreSQL is running on 127.0.0.1:54329. Keep this terminal open.');
let stopping = false;
async function stop() { if (stopping)
    return; stopping = true; await postgres.stop(); process.exit(0); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => { }, 60000);
