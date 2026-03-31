-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy data table
CREATE TABLE energy_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    voltage DECIMAL(10, 2) NOT NULL,
    current DECIMAL(10, 2) NOT NULL,
    power DECIMAL(10, 2) NOT NULL,
    energy DECIMAL(10, 5) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES users(device_id)
);

-- User settings table
CREATE TABLE user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    power_threshold DECIMAL(10, 2) DEFAULT 2000,
    monthly_limit DECIMAL(10, 2) DEFAULT 500,
    voltage_min DECIMAL(10, 2) DEFAULT 200,
    voltage_max DECIMAL(10, 2) DEFAULT 250,
    FOREIGN KEY (device_id) REFERENCES users(device_id)
);

-- Create index for faster queries
CREATE INDEX idx_device_timestamp ON energy_data(device_id, timestamp DESC);
