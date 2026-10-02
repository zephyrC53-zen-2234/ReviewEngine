import {writeFileSync,existsSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
if(existsSync('.env')){console.log('.env already exists; preserved.');}else{writeFileSync('.env',`DATABASE_URL="postgresql://reviewengine:reviewengine_local@127.0.0.1:54329/reviewengine"\nNEXTAUTH_URL="http://localhost:3000"\nNEXTAUTH_SECRET="${randomBytes(32).toString('base64url')}"\nSEED_DEMO="true"\n`,{mode:0o600});console.log('Created .env with a unique authentication secret.');}
