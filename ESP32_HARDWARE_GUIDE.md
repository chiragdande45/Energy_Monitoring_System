# 🔌 ESP32 Energy Monitor - Hardware Setup Guide

## 📋 **Required Components:**

### **Main Components:**
- ESP32 Development Board (30-pin or 38-pin)
- ZMPT101B AC Voltage Sensor Module
- ACS712 Current Sensor Module (5A, 20A, or 30A)
- Breadboard or PCB
- Jumper wires
- 5V Power Supply
- Enclosure (optional)

### **Optional Components:**
- 0.96" OLED Display (I2C)
- Relay Module (for load control)
- Buzzer (for alerts)
- Push buttons (for manual control)

## 🔧 **Wiring Connections:**

### **ESP32 Pinout:**
```
ESP32 Pin    | Component        | Description
-------------|------------------|------------------
GPIO 34      | ZMPT101B OUT     | Voltage sensor (ADC1_CH6)
GPIO 35      | ACS712 OUT       | Current sensor (ADC1_CH7)
GPIO 2       | LED              | Status indicator (built-in)
GPIO 4       | Relay IN         | Load control (optional)
3.3V         | Sensor VCC       | Power for sensors
GND          | Sensor GND       | Common ground
5V           | Relay VCC        | Relay power (if used)
```

### **ZMPT101B Voltage Sensor:**
```
ZMPT101B     | ESP32
-------------|--------
VCC          | 3.3V
GND          | GND
OUT          | GPIO 34
```

### **ACS712 Current Sensor:**
```
ACS712       | ESP32
-------------|--------
VCC          | 5V (or 3.3V)
GND          | GND
OUT          | GPIO 35
```

## ⚡ **Sensor Specifications:**

### **ZMPT101B Voltage Sensor:**
- **Input Voltage:** 0-250V AC
- **Output Voltage:** 0-5V DC
- **Accuracy:** ±1%
- **Frequency:** 50/60Hz
- **Isolation:** Yes (transformer isolated)

**Calibration Formula:**
```cpp
float voltage = (analogValue * 3.3 / 4095.0 - 1.65) * 234.26;
```

### **ACS712 Current Sensor Variants:**
| Model    | Range | Sensitivity | Zero Point |
|----------|-------|-------------|------------|
| ACS712-5A| ±5A   | 185 mV/A    | 2.5V       |
| ACS712-20A| ±20A | 100 mV/A    | 2.5V       |
| ACS712-30A| ±30A | 66 mV/A     | 2.5V       |

**Calibration Formula:**
```cpp
float current = (analogVoltage - 2.5) / sensitivity;
```

## 🔌 **AC Mains Connection (⚠️ DANGER - HIGH VOLTAGE):**

### **⚠️ SAFETY WARNING:**
- **NEVER work on live circuits**
- **Turn OFF main breaker before wiring**
- **Use proper insulation and enclosures**
- **Get professional help if unsure**
- **Follow local electrical codes**

### **Voltage Sensor Connection:**
```
AC Mains Hot Wire → ZMPT101B Primary (Input)
ZMPT101B Secondary → ESP32 GPIO 34
```

### **Current Sensor Connection:**
```
AC Mains Hot Wire → ACS712 Primary Terminal
ACS712 Secondary → ESP32 GPIO 35
```

## 📊 **Calibration Process:**

### **1. Voltage Calibration:**
```cpp
// Measure known AC voltage with multimeter
// Adjust VOLTAGE_CALIBRATION value until ESP32 matches
const float VOLTAGE_CALIBRATION = 234.26;  // Adjust this value
```

### **2. Current Calibration:**
```cpp
// Use known load (like 100W bulb = 100W/230V = 0.43A)
// Adjust CURRENT_CALIBRATION based on ACS712 model
const float CURRENT_CALIBRATION = 0.066;   // For ACS712-30A
```

### **3. Test Setup:**
1. Connect a known load (like LED bulb)
2. Measure with multimeter
3. Compare with ESP32 readings
4. Adjust calibration values

## 🏠 **Installation Options:**

### **Option 1: Breadboard Prototype**
- Quick testing and development
- Easy to modify connections
- Not suitable for permanent installation

### **Option 2: PCB Assembly**
- Permanent and reliable connections
- Compact design
- Professional appearance

### **Option 3: DIN Rail Mount**
- Industrial installation
- Easy panel mounting
- Professional electrical cabinet integration

## 📱 **Web Interface Access:**

After uploading code and connecting to WiFi:
1. **Find ESP32 IP:** Check Serial Monitor
2. **Open Browser:** Go to `http://ESP32_IP_ADDRESS`
3. **View Dashboard:** Real-time readings and status
4. **API Access:** `http://ESP32_IP_ADDRESS/api/data`

## 🔧 **Troubleshooting:**

### **Common Issues:**

**Voltage Reading Zero:**
- Check ZMPT101B connections
- Verify AC input is connected
- Check calibration value

**Current Reading Incorrect:**
- Ensure current flows through ACS712 primary
- Check ACS712 model and sensitivity
- Verify zero-point calibration

**WiFi Connection Failed:**
- Check SSID and password
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Check signal strength

**Server Connection Failed:**
- Verify server IP address
- Check if backend is running
- Ensure firewall allows connection

## 🎯 **Next Steps:**
1. ✅ Wire hardware components
2. ✅ Upload full functional code
3. ✅ Calibrate sensors with known loads
4. ✅ Test web interface
5. ✅ Verify data transmission to backend
6. ✅ Install in electrical panel (with professional help)