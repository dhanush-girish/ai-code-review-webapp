const postgres = require('postgres');

let sql;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      const originalHost = dbUrl.hostname;
      
      // Override connect configurations explicitly
      sql = postgres({
        host: '100.51.95.243', // Hardcoded IP to bypass ISP blocking neon endpoints mapping
        port: parseInt(dbUrl.port || '5432', 10),
        database: dbUrl.pathname.slice(1),
        user: dbUrl.username,
        password: decodeURIComponent(dbUrl.password),
        ssl: {
          rejectUnauthorized: false, // We disable cert validation since cert might complain if host doesn't match SNI exactly for neon
          servername: originalHost,   // Send proper SNI to Neon's TLS proxy
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
