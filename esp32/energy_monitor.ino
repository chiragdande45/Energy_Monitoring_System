/*
 * ESP32 Energy Monitor
 * Sends voltage, current, power, and energy data to backend API
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API endpoint
const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/sensor-data";

// Device ID (must match registered device in database)
const char* deviceId = "ESP32_001";

// Sensor pins (adjust based on your hardware)
const int voltagePin = 34;  // ADC pin for voltage sensor
const int currentPin = 35;  // ADC pin for current sensor

// Calibration factors (adjust based on your sensors)
const float voltageCalibration = 0.0625;  // Voltage divider ratio
const float currentCalibration = 0.066;   // Current sensor sensitivity

// Variables
float voltage = 0;
float current = 0;
float power = 0;
float energy = 0;
unsigned long lastTime = 0;
const unsigned long interval = 1000;  // Send data every 1 second

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastTime >= interval) {
    lastTime = currentTime;
    
    // Read sensor values
    readSensors();
    
    // Calculate energy (kWh)
    energy = (power * (interval / 1000.0)) / 3600000.0;
    
    // Send data to server
    sendDataToServer();
    
    // Print to serial monitor
    printData();
  }
}

void readSensors() {
  // Read voltage (example: using voltage divider)
  int voltageRaw = analogRead(voltagePin);
  voltage = (voltageRaw * 3.3 / 4095.0) / voltageCalibration;
  
  // Read current (example: using ACS712 sensor)
  int currentRaw = analogRead(currentPin);
  float currentVoltage = (currentRaw * 3.3 / 4095.0);
  current = (currentVoltage - 1.65) / currentCalibration;
  
  // Ensure current is positive
  if (current < 0) current = 0;
  
  // Calculate power
  power = voltage * current;
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["device_id"] = deviceId;
    doc["voltage"] = voltage;
    doc["current"] = current;
    doc["power"] = power;
    doc["energy"] = energy;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

void printData() {
  Serial.println("=== Energy Monitor Data ===");
  Serial.print("Voltage: ");
  Serial.print(voltage);
  Serial.println(" V");
  
  Serial.print("Current: ");
  Serial.print(current);
  Serial.println(" A");
  
  Serial.print("Power: ");
  Serial.print(power);
  Serial.println(" W");
  
  Serial.print("Energy: ");
  Serial.print(energy, 5);
  Serial.println(" kWh");
  Serial.println("===========================\n");
}
