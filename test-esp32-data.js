// ESP32 Data Simulator
// This script simulates ESP32 sending energy data to the backend

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuration - You can change this for different update speeds
const UPDATE_INTERVAL = 1000; // milliseconds (1000 = 1 second, 500 = 0.5 seconds)

// Simulate realistic energy data
function generateSensorData() {
  const baseVoltage = 230;
  const baseCurrent = Math.random() * 10 + 2; // 2-12 Amperes
  
  return {
    device_id: 'ESP32_001',
    voltage: baseVoltage + (Math.random() - 0.5) * 10, // 225-235V
    current: baseCurrent + (Math.random() - 0.5) * 2,
    power: (baseVoltage * baseCurrent) + (Math.random() - 0.5) * 100,
    energy: Math.random() * 0.01 + 0.001 // Small incremental energy
  };
}

// Send data at configured interval
async function sendData() {
  try {
    const data = generateSensorData();
    console.log('Sending data:', data);
    
    const response = await axios.post(`${API_URL}/sensor-data`, data, {
      headers: {
        'User-Agent': 'ESP32-Simulator/1.0 (Node.js)'
      }
    });
    console.log('✅ Data sent successfully:', response.data);
  } catch (error) {
    console.error('❌ Error sending data:', error.response?.data || error.message);
  }
}

// Start simulation
console.log('🚀 Starting ESP32 Data Simulation...');
console.log('📡 Sending data to:', API_URL);

// Send initial data
sendData();

// Send data at configured interval
setInterval(sendData, UPDATE_INTERVAL);

console.log(`⚡ Simulation running with ${UPDATE_INTERVAL}ms intervals... Press Ctrl+C to stop`);