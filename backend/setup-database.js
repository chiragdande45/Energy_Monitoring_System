import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Chi2006r@g',
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS energy_monitor');
    console.log('✓ Database "energy_monitor" created/verified');

    // Use the database
    await connection.query('USE energy_monitor');
    console.log('✓ Using database "energy_monitor"');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('✓ Database tables created successfully');
    console.log('\n✅ Database setup complete!');
    console.log('\nYou can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
