# 🔌 ESP32 Connection Test Guide

## 📋 **What You Need:**
- ESP32 development board
- USB cable
- Arduino IDE installed
- WiFi network credentials

## 🔧 **Step-by-Step Setup:**

### **1. Prepare Arduino IDE:**
```
1. Open Arduino IDE
2. Install ESP32 board package:
   - File → Preferences
   - Additional Board Manager URLs: 
     https://dl.espressif.com/dl/package_esp32_index.json
   - Tools → Board → Boards Manager
   - Search "ESP32" and install

3. Install required libraries:
   - Sketch → Include Library → Manage Libraries
   - Search and install: "ArduinoJson"
```

### **2. Update ESP32 Code:**
```cpp
// In connection_test.ino, change these lines:
const char* ssid = "YOUR_ACTUAL_WIFI_NAME";
const char* password = "YOUR_ACTUAL_WIFI_PASSWORD";
const char* serverUrl = "http://10.156.5.250:5000/api/sensor-data";
```

### **3. Upload Code to ESP32:**
```
1. Connect ESP32 to computer via USB
2. Select board: Tools → Board → ESP32 Dev Module
3. Select port: Tools → Port → (your ESP32 port)
4. Upload: Sketch → Upload (Ctrl+U)
```

### **4. Start Your Backend Server:**
```bash
# Run this command in your project folder:
node start-for-esp32-test.js
```

### **5. Monitor ESP32:**
```
1. Open Serial Monitor: Tools → Serial Monitor
2. Set baud rate to 115200
3. Watch for connection messages
```

## 📊 **Expected Output:**

### **ESP32 Serial Monitor:**
```
=== ESP32 Connection Test ===
Starting WiFi connection...
Connecting to WiFi........
✅ WiFi Connected Successfully!
📶 Network: YourWiFiName
📍 ESP32 IP Address: 192.168.1.123
📡 Signal Strength: -45 dBm

📡 Sending test data to server...
🌐 Server URL: http://10.156.5.250:5000/api/sensor-data
📤 Sending: {"device_id":"ESP32_001","voltage":232,"current":5.2,"power":1205,"energy":0.0012}
✅ Server Response (201): {"message":"Data stored successfully"}
🎉 SUCCESS! ESP32 is connected and sending data!
```

### **Your Computer Console:**
```
🚀 Backend server running on port 5000
📡 New sensor data received from ESP32_001
✅ Data stored in database
```

## 🎯 **Success Indicators:**

### **✅ Connection Working:**
- ESP32 shows "WiFi Connected Successfully"
- ESP32 gets IP address (like 192.168.1.123)
- Server responds with "201" status code
- Backend console shows "Data stored successfully"

### **❌ Common Issues:**

**WiFi Connection Failed:**
- Check WiFi name and password spelling
- Make sure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Check WiFi signal strength

**HTTP Error -1:**
- Wrong server IP address
- Backend server not running
- Firewall blocking connection

**HTTP Error 500:**
- Database connection issue
- Check if MySQL is running

## 🔍 **Testing Commands:**

### **Check if backend is running:**
```bash
curl http://localhost:5000/api/sensor-data
```

### **Test from another device:**
```bash
curl -X POST http://10.156.5.250:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","voltage":230,"current":5,"power":1150,"energy":0.001}'
```

## 🎉 **Next Steps After Success:**
1. ✅ ESP32 connects to WiFi
2. ✅ ESP32 sends data to your backend
3. ✅ Backend receives and stores data
4. 🔄 Ready to add real sensors (voltage/current sensors)
5. 🔄 Ready to connect hardware components