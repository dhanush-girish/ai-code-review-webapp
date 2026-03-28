require('dotenv').config();
const { getDb } = require('./src/db/pool');
const sql = getDb();
sql`SELECT 1`.then(console.log).catch(console.error).finally(() => process.exit(0));
