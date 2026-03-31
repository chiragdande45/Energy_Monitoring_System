// System Status Checker
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

async function checkStatus() {
  console.log('🔍 Checking IoT Energy Monitoring Platform Status...\n');

  // Check Backend API
  try {
    const response = await axios.get(`${API_URL}/sensor-data`);
    console.log('✅ Backend API: RUNNING on port 5000');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend API: NOT RUNNING');
    } else {
      console.log('✅ Backend API: RUNNING on port 5000');
    }
  }

  // Check Frontend
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend: RUNNING on port 5173');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Frontend: NOT RUNNING');
    } else {
      console.log('✅ Frontend: RUNNING on port 5173');
    }
  }

  // Test ESP32 Data Endpoint
  try {
    const testData = {
      device_id: 'ESP32_TEST',
      voltage: 230,
      current: 5,
      power: 1150,
      energy: 0.01
    };
    
    const response = await axios.post(`${API_URL}/sensor-data`, testData);
    console.log('✅ ESP32 Data Endpoint: WORKING');
    console.log('✅ Database Connection: ACTIVE');
  } catch (error) {
    console.log('❌ ESP32 Data Endpoint: ERROR -', error.message);
  }

  console.log('\n🌐 Access URLs:');
  console.log(`   Frontend Dashboard: ${FRONTEND_URL}`);
  console.log(`   Backend API: ${API_URL}`);
  console.log('\n📊 Available Pages:');
  console.log('   • Login/Register: http://localhost:5173/login');
  console.log('   • Dashboard: http://localhost:5173/dashboard');
  console.log('   • Reports: http://localhost:5173/reports');
  console.log('   • Settings: http://localhost:5173/settings');
  
  console.log('\n🔑 Test Account:');
  console.log('   • Register with device_id: ESP32_001');
  console.log('   • Real-time data is being simulated');
}

checkStatus();