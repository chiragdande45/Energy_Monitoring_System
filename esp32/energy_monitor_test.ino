/*
 * ESP32 Energy Monitor - Test Version (No Sensors Required)
 * Use this for initial WiFi and server connection testing
 * Generates realistic fake data for testing your platform
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>

// ========== CONFIGURATION ==========
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://192.168.137.1:5000/api/sensor-data";
const char* deviceId = "ESP32_001";

// Pins
const int LED_PIN = 2;

// Variables
float voltage = 0.0;
float current = 0.0;
float power = 0.0;
float energy = 0.0;
unsigned long lastSendTime = 0;
bool wifiConnected = false;

WebServer server(80);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("\n🔌 ESP32 ENERGY MONITOR - TEST MODE");
  Serial.println("📡 Generating fake sensor data for testing");
  Serial.println("Device ID: " + String(deviceId));
  
  connectToWiFi();
  setupWebServer();
  
  Serial.println("✅ Ready! Sending test data every 5 seconds...\n");
}

void loop() {
  server.handleClient();
  
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
    return;
  }
  
  // Generate realistic fake data
  generateTestData();
  
  // Send data every 1 second
  if (millis() - lastSendTime >= 1000) {
    sendDataToServer();
    displayReadings();
    lastSendTime = millis();
  }
  
  // Blink LED
  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 1000) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    lastBlink = millis();
  }
  
  delay(100);
}

void connectToWiFi() {
  Serial.print("📶 Connecting to WiFi: " + String(ssid));
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("\n✅ WiFi Connected!");
    Serial.println("📍 IP: " + WiFi.localIP().toString());
    Serial.println("🌐 Web: http://" + WiFi.localIP().toString());
  } else {
    Serial.println("\n❌ WiFi Failed!");
    wifiConnected = false;
  }
}

void generateTestData() {
  // Generate realistic household electrical values
  static float baseVoltage = 230.0;
  static float baseCurrent = 5.0;
  static unsigned long lastTime = millis();
  
  // Add some realistic variation
  voltage = baseVoltage + random(-10, 10);  // 220-240V
  current = baseCurrent + random(-20, 20) / 10.0;  // 3-7A
  power = voltage * current;
  
  // Calculate energy (kWh)
  float timeHours = (millis() - lastTime) / 3600000.0;
  energy = power * timeHours;
  lastTime = millis();
}

void sendDataToServer() {
  if (!wifiConnected) return;
  
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["device_id"] = deviceId;
  doc["voltage"] = round(voltage * 100) / 100.0;
  doc["current"] = round(current * 100) / 100.0;
  doc["power"] = round(power * 100) / 100.0;
  doc["energy"] = round(energy * 10000) / 10000.0;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode == 201) {
    Serial.println("✅ Data sent successfully!");
  } else {
    Serial.println("❌ HTTP Error: " + String(httpResponseCode));
  }
  
  http.end();
}

void displayReadings() {
  Serial.println("📊 Voltage: " + String(voltage, 2) + "V | Current: " + 
                String(current, 2) + "A | Power: " + String(power, 2) + "W");
}

void setupWebServer() {
  server.on("/", []() {
    String html = "<!DOCTYPE html><html><head><title>ESP32 Test</title></head><body>";
    html += "<h1>ESP32 Energy Monitor - Test Mode</h1>";
    html += "<p>Voltage: " + String(voltage, 2) + " V</p>";
    html += "<p>Current: " + String(current, 2) + " A</p>";
    html += "<p>Power: " + String(power, 2) + " W</p>";
    html += "<p>Status: Generating fake data for testing</p>";
    html += "<script>setTimeout(function(){location.reload()},3000);</script>";
    html += "</body></html>";
    server.send(200, "text/html", html);
  });
  
  server.begin();
}