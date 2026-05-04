/*
 * ESP32 Energy Monitor - Accurate Sensor Version
 * Uses RMS calculation for accurate AC measurements
 * Includes calibration and noise filtering
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ========== UPDATE THESE VALUES ==========
const char* ssid = "AB";                       // Replace with your WiFi name
const char* password = "Chirag45";             // Replace with your WiFi password
const char* serverUrl = "http://10.182.115.250:5001/api/sensor-data";  // Updated to correct IP
const char* deviceId = "ESP32_001";

// ========== PIN DEFINITIONS ========
#define CURRENT_PIN 34
#define VOLTAGE_PIN 35
#define LED_PIN 2

// ========== SENSOR CONFIG ========
float sensitivity = 0.185;   // ACS712 5A → 185mV/A (adjust if using different model)

// ========== CALIBRATION VALUES ========
float offsetCurrent = 0;
float offsetVoltage = 0;

// ========== VARIABLES ========
float currentRMS = 0;
float voltageRMS = 0;
float power = 0.0;
float energy = 0.0;

// ========== SETTINGS ========
int calibrationSamples = 3000;   // increased for better offset
int measurementSamples = 1000;   // more samples = better RMS
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 1000; // 1 second

// ========== CALIBRATION FUNCTION ========
void calibrateOffsets() {
  float sumCurrent = 0;
  float sumVoltage = 0;
  
  Serial.println("Calibrating... Keep NO LOAD!");
  
  for (int i = 0; i < calibrationSamples; i++) {
    sumCurrent += (analogRead(CURRENT_PIN) / 4095.0) * 3.3;
    sumVoltage += (analogRead(VOLTAGE_PIN) / 4095.0) * 3.3;
    delayMicroseconds(200);   // faster sampling
  }
  
  offsetCurrent = sumCurrent / calibrationSamples;
  offsetVoltage = sumVoltage / calibrationSamples;
  
  Serial.println("Calibration Done:");
  Serial.print("Offset Current: ");
  Serial.println(offsetCurrent, 4);
  Serial.print("Offset Voltage: ");
  Serial.println(offsetVoltage, 4);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  
  Serial.println();
  Serial.println("====================================");
  Serial.println("ESP32 Energy Monitor Starting...");
  Serial.println("====================================");
  Serial.println("Device ID: " + String(deviceId));
  Serial.println("Server: " + String(serverUrl));
  Serial.println("====================================");
  
  // Calibrate sensors
  delay(3000);
  calibrateOffsets();
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("Setup complete. Starting measurements...");
}

void loop() {
  // Read sensors
  readSensors();
  
  // Send data every second
  if (millis() - lastSendTime >= sendInterval) {
    sendDataToServer();
    lastSendTime = millis();
  }
  
  // Blink LED to show activity
  digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  
  delay(100);
}

void readSensors() {
  float sumCurrent = 0;
  float sumVoltage = 0;
  
  for (int i = 0; i < measurementSamples; i++) {
    float rawCurrent = 0;
    float rawVoltage = 0;
    
    // averaging to reduce noise
    for (int j = 0; j < 5; j++) {
      rawCurrent += analogRead(CURRENT_PIN);
      rawVoltage += analogRead(VOLTAGE_PIN);
    }
    rawCurrent /= 5.0;
    rawVoltage /= 5.0;
    
    // ADC → voltage
    float voltageCurrent = (rawCurrent / 4095.0) * 3.3;
    float voltageSensor  = (rawVoltage / 4095.0) * 3.3;
    
    // remove offset
    float currentValue = voltageCurrent - offsetCurrent;
    float voltageValue = voltageSensor - offsetVoltage;
    
    sumCurrent += currentValue * currentValue;
    sumVoltage += voltageValue * voltageValue;
    
    delayMicroseconds(200);
  }
  
  // ========== RMS CALCULATION ========
  currentRMS = sqrt(sumCurrent / measurementSamples) / sensitivity;
  voltageRMS = sqrt(sumVoltage / measurementSamples);
  
  // ========== NOISE FILTER (VERY IMPORTANT) ========
  if (currentRMS < 0.05) currentRMS = 0;     // remove fake current (<50mA)
  if (voltageRMS < 0.01) voltageRMS = 0;     // remove noise
  
  // ========== VOLTAGE SCALING ========
  // ⚠️ IMPORTANT: adjust this after calibration
  float voltageCalibrationFactor = 230.0 / 1.65;  // Adjust based on your AC supply
  voltageRMS = voltageRMS * voltageCalibrationFactor;
  
  // ========== POWER CALCULATION ========
  power = voltageRMS * currentRMS;
  energy = power * (sendInterval / 1000.0) / 3600000.0; // Convert to kWh
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi: " + String(ssid));
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi Connected!");
    Serial.println("IP Address: " + WiFi.localIP().toString());
  } else {
    Serial.println();
    Serial.println("WiFi Connection Failed!");
  }
}

void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, attempting reconnection...");
    connectToWiFi();
    return;
  }
  
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("User-Agent", "ESP32-EnergyMonitor/1.0");
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["device_id"] = deviceId;
  doc["voltage"] = round(voltageRMS * 100) / 100.0;
  doc["current"] = round(currentRMS * 1000) / 1000.0;  // in Amps
  doc["power"] = round(power * 100) / 100.0;
  doc["energy"] = round(energy * 10000) / 10000.0;
  doc["timestamp"] = millis();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Data sent successfully!");
    Serial.print("V:" + String(voltageRMS, 1) + "V, ");
    Serial.print("I:" + String(currentRMS * 1000, 1) + "mA, ");
    Serial.println("P:" + String(power, 1) + "W");
  } else {
    Serial.println("Error sending data. HTTP Code: " + String(httpResponseCode));
  }
  
  http.end();
}