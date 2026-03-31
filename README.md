# 🔋 IoT Energy Monitoring System

A comprehensive real-time energy monitoring system built with ESP32, Node.js, React, and MySQL. Monitor your electrical consumption with live data visualization, cost estimation, and smart alerts.

![Energy Monitoring System](https://img.shields.io/badge/Status-Active-brightgreen)
![ESP32](https://img.shields.io/badge/ESP32-Compatible-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

## ✨ Features

### 📊 Real-Time Monitoring
- **Live Data Updates**: 1-second interval updates for real-time monitoring
- **Interactive Charts**: Beautiful, responsive charts showing power consumption trends
- **Multi-Parameter Tracking**: Voltage, Current, Power, and Energy consumption
- **30-Second History**: Visual timeline of recent power usage

### 🎯 Smart Analytics
- **Cost Estimation**: Automatic electricity bill calculation based on tariff slabs
- **Peak Usage Detection**: Identify high-consumption periods
- **Energy Saving Tips**: Intelligent recommendations for reducing consumption
- **Monthly Reports**: Comprehensive usage analysis and PDF reports

### 🚨 Alert System
- **Threshold Monitoring**: Customizable power and voltage limits
- **Real-Time Notifications**: Instant alerts for abnormal readings
- **Visual Indicators**: Color-coded status indicators for quick assessment

### 🌐 Modern Web Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-Time Status**: Live connection status with ESP32 device
- **User Authentication**: Secure login system with device-specific access

## 🏗️ System Architecture

```
┌─────────────────┐    WiFi     ┌──────────────────┐    HTTP/WS    ┌─────────────────┐
│     ESP32       │ ──────────► │   Node.js API    │ ────────────► │   React Web     │
│  (Hardware)     │             │   (Backend)      │               │   (Frontend)    │
│                 │             │                  │               │                 │
│ • Voltage Sensor│             │ • REST API       │               │ • Dashboard     │
│ • Current Sensor│             │ • WebSocket      │               │ • Charts        │
│ • WiFi Module   │             │ • Authentication │               │ • Reports       │
│ • Data Logging  │             │ • Data Storage   │               │ • Settings      │
└─────────────────┘             └──────────────────┘               └─────────────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │   MySQL DB       │
                                │  (Database)      │
                                │                  │
                                │ • User Data      │
                                │ • Energy Logs    │
                                │ • Settings       │
                                │ • Reports        │
                                └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- ESP32 development board
- Current sensor (ACS712 or similar)
- Voltage sensor/divider circuit

### 1. Clone Repository
```bash
git clone https://github.com/chiragdande45/Energy_Monitoring_System.git
cd Energy_Monitoring_System
```

### 2. Database Setup
```bash
# Install MySQL and create database
mysql -u root -p
CREATE DATABASE energy_monitoring;
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. ESP32 Setup
1. Open `esp32/COMPLETE_ESP32_CODE.ino` in Arduino IDE
2. Install required libraries:
   - WiFi
   - HTTPClient
   - ArduinoJson
   - WebServer
3. Update configuration:
   - WiFi credentials
   - Server IP address
   - Device ID
4. Upload to ESP32

## 📱 Usage

### Web Dashboard
1. Open http://localhost:5173
2. Register with your ESP32 device ID
3. View real-time energy data
4. Monitor costs and usage patterns
5. Configure alerts and thresholds

### ESP32 Device
1. Power on the ESP32
2. Connect to WiFi automatically
3. Start sending sensor data
4. Monitor via built-in web interface (ESP32's IP address)

## 🔧 Configuration

### Backend Configuration (`backend/.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=energy_monitoring
JWT_SECRET=your_jwt_secret
PORT=5000
```

### ESP32 Configuration
```cpp
// WiFi Settings
const char* WIFI_SSID = "Your_WiFi_Name";
const char* WIFI_PASSWORD = "Your_WiFi_Password";

// Server Settings
const char* SERVER_URL = "http://YOUR_COMPUTER_IP:5000/api/sensor-data";
const char* DEVICE_ID = "ESP32_001";
```

### Update Intervals
- **Real-time updates**: 1 second (configurable)
- **Chart data retention**: 30 seconds
- **API backup calls**: 5 seconds
- **Database cleanup**: Daily

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Energy Data
- `POST /api/sensor-data` - Store sensor readings (ESP32)
- `GET /api/energy/live` - Get latest readings
- `GET /api/energy/history` - Get historical data
- `GET /api/energy/cost` - Get cost estimates

### Settings
- `GET /api/energy/settings` - Get user settings
- `PUT /api/energy/settings` - Update settings

## 🛠️ Hardware Setup

### Required Components
- ESP32 development board
- ACS712 current sensor (30A recommended)
- Voltage divider circuit (for AC voltage measurement)
- Breadboard and jumper wires
- Power supply (5V/3.3V)

### Wiring Diagram
```
ESP32 Pin    →    Component
GPIO 34      →    Current Sensor (Analog Out)
GPIO 35      →    Voltage Sensor (Analog Out)
GPIO 2       →    Status LED
3.3V         →    Sensor VCC
GND          →    Sensor GND
```

### Safety Warning ⚠️
- **High Voltage**: Be extremely careful when working with AC mains voltage
- **Isolation**: Use proper isolation circuits for voltage measurement
- **Testing**: Test with low voltage DC first before connecting to AC mains
- **Professional Help**: Consider consulting an electrician for AC connections

## 🧪 Testing & Simulation

### Simulation Mode
For testing without hardware:
```bash
# Run simulation script
node test-esp32-data.js
```

This generates realistic sensor data for development and testing.

### Connection Testing
```bash
# Test ESP32 connectivity
node test-db.js
```

## 📈 Performance

### System Specifications
- **Update Rate**: 1 second real-time updates
- **Data Retention**: 30 seconds live, unlimited historical
- **Concurrent Users**: 100+ supported
- **Database**: Optimized for time-series data
- **Response Time**: <100ms for live data

### Optimization Features
- WebSocket for real-time communication
- Efficient database indexing
- Client-side data caching
- Responsive chart rendering
- Mobile-optimized interface

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ESP32 community for excellent documentation
- Chart.js for beautiful visualizations
- Node.js and React communities
- Open source contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/chiragdande45/Energy_Monitoring_System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chiragdande45/Energy_Monitoring_System/discussions)
- **Email**: [Your Email]

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Machine learning predictions
- [ ] Multi-device support
- [ ] Cloud deployment guides
- [ ] Advanced analytics dashboard
- [ ] Integration with smart home systems

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Chirag Dande](https://github.com/chiragdande45)
