# Changelog

All notable changes to the IoT Energy Monitoring System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-31

### Added
- **Real-time Energy Monitoring**: Complete system for monitoring electrical consumption
- **ESP32 Integration**: Full support for ESP32 microcontroller with sensor integration
- **Web Dashboard**: React-based responsive web interface with real-time charts
- **Backend API**: Node.js server with REST API and WebSocket support
- **Database System**: MySQL database for storing energy data and user information
- **User Authentication**: Secure login system with JWT tokens
- **Device Management**: Multi-device support with device-specific data isolation
- **Real-time Updates**: 1-second interval updates for live monitoring
- **Interactive Charts**: Beautiful, responsive charts using Recharts library
- **Cost Estimation**: Automatic electricity bill calculation based on tariff slabs
- **Smart Alerts**: Configurable thresholds for power and voltage monitoring
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Simulation Mode**: Test mode with realistic data generation for development
- **Status Detection**: Intelligent detection of ESP32 vs simulated data sources
- **PDF Reports**: Generate detailed energy consumption reports
- **Settings Management**: Customizable user preferences and alert thresholds

### Technical Features
- **WebSocket Communication**: Real-time bidirectional communication
- **Data Visualization**: Interactive charts with 30-second live history
- **Performance Optimized**: Efficient database queries and client-side caching
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Input validation, SQL injection prevention, and secure authentication
- **Documentation**: Comprehensive setup guides and API documentation
- **Testing Tools**: Simulation scripts and connection testing utilities

### Hardware Support
- **ESP32 Compatibility**: Full support for ESP32 development boards
- **Sensor Integration**: ACS712 current sensor and voltage divider circuits
- **WiFi Connectivity**: Automatic WiFi connection and reconnection
- **Web Interface**: Built-in ESP32 web server for device monitoring
- **Status Indicators**: LED indicators for connection and operation status
- **Safety Features**: Proper isolation and safety considerations for AC measurement

### Development Tools
- **Hot Reload**: Development server with hot module replacement
- **Database Setup**: Automated database schema creation and seeding
- **Status Monitoring**: System health check and status reporting tools
- **Batch Scripts**: Easy project startup with automated script
- **Git Integration**: Proper version control setup with comprehensive .gitignore

## [Unreleased]

### Planned Features
- Mobile app (React Native)
- Machine learning predictions for energy usage
- Multi-device dashboard view
- Cloud deployment guides
- Advanced analytics and insights
- Integration with smart home systems
- Energy efficiency recommendations
- Historical data export features
- API rate limiting and advanced security
- Docker containerization
- Automated testing suite
- Performance monitoring and logging

---

For more details about each release, visit the [GitHub Releases](https://github.com/chiragdande45/Energy_Monitoring_System/releases) page.