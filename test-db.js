// Database Connection Test
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Database Connection: SUCCESS');
    
    // Test if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log('✅ Database Tables:', tables.map(t => Object.values(t)[0]));
    
    // Test energy_data table
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM energy_data');
    console.log('✅ Energy Data Records:', rows[0].count);
    
    await connection.end();
    console.log('✅ Database Test: PASSED\n');
    
  } catch (error) {
    console.log('❌ Database Connection: FAILED');
    console.log('Error:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔧 Fix: Run database setup script');
      console.log('   cd backend && node setup-database.js');
    }
  }
}

testDatabase();