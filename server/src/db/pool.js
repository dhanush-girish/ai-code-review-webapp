const postgres = require('postgres');

let sql;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      
      sql = postgres({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port || '5432', 10),
        database: dbUrl.pathname.slice(1),
        user: dbUrl.username,
        password: decodeURIComponent(dbUrl.password),
        ssl: {
          rejectUnauthorized: false,
          servername: dbUrl.hostname,
        },
        connection: {
          application_name: 'postgres.js' 
        }
      });
    } catch (e) {
      console.error("Failed to parse DB URL", e);
      throw e;
    }
  }
  return sql;
}

module.exports = { getDb };
