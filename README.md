# ESP32 Energy Monitor System

A real-time energy monitoring system using ESP32 microcontroller, Node.js backend, and React frontend.

## Project Structure

```
├── backend/                 # Node.js Express server
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── .env                # Environment variables
│   ├── .env.example        # Example environment file
│   ├── package.json        # Dependencies
│   └── server.js           # Main server file
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (real-time data)
│   │   ├── services/       # API and WebSocket services
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── esp32/                  # ESP32 firmware
│   └── WORKING_ESP32_CODE.ino  # Main ESP32 code
│
├── database/               # Database schema
│   └── schema.sql          # MySQL database schema
│
└── README.md              # This file
```

## Features

- ✅ Real-time energy monitoring (Voltage, Current, Power)
- ✅ Energy consumption tracking and reporting
- ✅ Alert system for power and voltage thresholds
- ✅ Monthly cost estimation
- ✅ Live data dashboard with charts
- ✅ User authentication and device management
- ✅ WebSocket real-time updates
- ✅ Responsive UI with dark mode

## Hardware Requirements

- ESP32 microcontroller
- ZMPT101B voltage sensor
- ACS712-5A current sensor
- WiFi connection (2.4GHz)

## Software Requirements

- Node.js (v14+)
- MySQL (v5.7+)
- Arduino IDE (for ESP32 programming)
- npm or yarn

## Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=energy_monitor
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Database Setup

Create MySQL database:
```bash
mysql -u root -p < database/schema.sql
```

### 4. ESP32 Setup

1. Open `esp32/WORKING_ESP32_CODE.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverUrl = "http://YOUR_SERVER_IP:5001/api/sensor-data";
   ```
3. Upload to ESP32

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5001`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Access Application
Open browser and go to: `http://localhost:5173`

## Default Login

- Email: `chirag@gmail.com`
- Device ID: `ESP32_001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Energy Data
- `POST /api/sensor-data` - Receive sensor data from ESP32
- `GET /api/live-data` - Get latest sensor reading
- `GET /api/history` - Get historical data
- `GET /api/monthly-cost` - Get monthly cost estimate
- `GET /api/peak-usage` - Get peak usage time
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## Sensor Configuration

### Voltage Sensor (ZMPT101B)
- Pin 1 (GND) → NEUTRAL wire
- Pin 2 (VCC) → LIVE wire (220-240V AC)
- Pin 3 (OUT) → ESP32 GPIO 35

### Current Sensor (ACS712-5A)
- Pin 1 (GND) → ESP32 GND
- Pin 2 (VOUT) → ESP32 GPIO 34
- Pin 3 (VCC) → ESP32 3.3V
- Pin 4 (IP+) → AC wire IN
- Pin 5 (IP-) → AC wire OUT

**Important**: AC wire must pass THROUGH the sensor hole, not just touch it.

## Troubleshooting

### ESP32 Not Connecting
- Verify WiFi SSID and password
- Check server URL and IP address
- Ensure WiFi is 2.4GHz (not 5GHz)

### No Data on Dashboard
- Check if backend is running on correct port
- Verify database connection
- Check browser console for errors

### Incorrect Readings
- Verify sensor connections
- Check sensor calibration
- Ensure AC wire passes through current sensor hole

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please check the troubleshooting section or contact support.
