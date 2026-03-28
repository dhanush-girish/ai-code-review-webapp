require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force Node.js to use Google's DNS to bypass local ISP blocking for Neon
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectionObj = {
  host: 'ep-damp-dream-anevww9d-pooler.c-6.us-east-1.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_7ctuTv6XzkPO',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false,
  }
};

// We intercept the DNS lookup inside the client!
dns.resolve4(connectionObj.host, async (err, addresses) => {
  if (err || !addresses.length) {
    console.error('❌ Still failed to resolve DNS using Google DNS:', err);
    return;
  }
  
  const targetIp = addresses[0];
  console.log('✅ Resolved Neon host to IP:', targetIp);
  
  // Now actually connect using the IP but pretending to be the hostname for SSL
  const client = new Client({
    host: targetIp,
    port: connectionObj.port,
    user: connectionObj.user,
    password: connectionObj.password,
    database: connectionObj.database,
    ssl: {
      rejectUnauthorized: true,
      servername: connectionObj.host
    }
  });

  try {
    console.log('Connecting to Neon database... (Waking up compute)');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Read the schema.sql file
    const schemaPath = path.join(__dirname, 'src', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema setup scripts...');
    await client.query(schemaSql);
    console.log('🎉 Database tables created successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
  } finally {
    await client.end();
  }
});
