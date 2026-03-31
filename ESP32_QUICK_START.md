# 🚀 ESP32 Quick Start Guide

## 📁 **Code Files Available:**

### **1. `energy_monitor_test.ino` - Start Here! 🎯**
- **Purpose:** Test WiFi and server connection
- **Hardware:** Only ESP32 board needed
- **Data:** Generates realistic fake sensor data
- **Best for:** Initial testing and verification

### **2. `energy_monitor_full.ino` - Complete System 🔌**
- **Purpose:** Full energy monitoring with real sensors
- **Hardware:** ESP32 + ZMPT101B + ACS712 sensors
- **Data:** Real voltage and current measurements
- **Best for:** Production deployment

### **3. `connection_test.ino` - Basic Test 📡**
- **Purpose:** Simple connection verification
- **Hardware:** Only ESP32 board needed
- **Data:** Basic test data
- **Best for:** Quick connection check

## 🎯 **Recommended Testing Sequence:**

### **Step 1: Basic Connection Test**
1. Upload `connection_test.ino`
2. Verify WiFi connection
3. Check server communication

### **Step 2: Advanced Test Mode**
1. Upload `energy_monitor_test.ino`
2. Test web interface
3. Verify data flow to your platform

### **Step 3: Hardware Integration**
1. Wire ZMPT101B and ACS712 sensors
2. Upload `energy_monitor_full.ino`
3. Calibrate sensors with known loads

## ⚙️ **Configuration Steps:**

### **1. Update WiFi Credentials:**
```cpp
const char* ssid = "YOUR_ACTUAL_WIFI_NAME";
const char* password = "YOUR_ACTUAL_WIFI_PASSWORD";
```

### **2. Update Server URL:**
```cpp
const char* serverUrl = "http://192.168.137.1:5000/api/sensor-data";
```

### **3. Arduino IDE Setup:**
```
1. Install ESP32 board package
2. Install ArduinoJson library
3. Select "ESP32 Dev Module" board
4. Select correct COM port
5. Upload code
```

## 📊 **Expected Results:**

### **Serial Monitor Output:**
```
🔌 ESP32 ENERGY MONITOR - TEST MODE
📶 Connecting to WiFi: YourWiFiName....
✅ WiFi Connected!
📍 IP: 192.168.1.123
🌐 Web: http://192.168.1.123
✅ Ready! Sending test data every 5 seconds...

📊 Voltage: 232.45V | Current: 5.67A | Power: 1318.03W
✅ Data sent successfully!
```

### **Your Backend Console:**
```
📡 New sensor data received from ESP32_001
✅ Data stored in database
```

### **Web Dashboard:**
- Login at: http://localhost:5173
- See real-time data updating
- Device status shows "Online"

## 🌐 **ESP32 Web Interface:**

Access at: `http://ESP32_IP_ADDRESS`

**Features:**
- Live sensor readings
- Connection status
- Device information
- Auto-refresh every 5 seconds
- JSON API endpoint: `/api/data`

## 🔧 **Troubleshooting:**

### **WiFi Issues:**
- Check SSID and password spelling
- Ensure 2.4GHz network (not 5GHz)
- Check signal strength

### **Server Connection Issues:**
- Verify backend server is running
- Check IP address in code
- Ensure firewall allows connection

### **Upload Issues:**
- Check COM port selection
- Press ESP32 boot button during upload
- Try different USB cable

## 🎉 **Success Indicators:**

### **✅ Everything Working:**
- ESP32 connects to WiFi
- Gets IP address
- Sends data every 5 seconds
- Backend receives data (201 response)
- Web dashboard shows live updates
- Device status shows "Online"

### **🎯 Ready for Next Steps:**
- Add real sensors (ZMPT101B, ACS712)
- Calibrate with known loads
- Install in electrical panel
- Deploy for production monitoring

## 📱 **Quick Commands:**

### **Check Backend Status:**
```bash
curl http://localhost:5000/api/sensor-data
```

### **Test ESP32 Endpoint:**
```bash
curl -X POST http://192.168.137.1:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","voltage":230,"current":5,"power":1150,"energy":0.001}'
```

Start with `energy_monitor_test.ino` for easiest setup! 🚀