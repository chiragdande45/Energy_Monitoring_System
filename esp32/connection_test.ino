/*
 * ESP32 Connection Test
 * Simple test to check if ESP32 can connect to your backend
 * No sensors needed - just WiFi connection test
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ========== CHANGE THESE VALUES ==========
const char* ssid = "YOUR_WIFI_NAME";           // Replace with your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password
const char* serverUrl = "http://10.156.5.250:5000/api/sensor-data";  // Your computer's IP
// =========================================

const char* deviceId = "ESP32_001";

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32 Connection Test ===");
  Serial.println("Starting WiFi connection...");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected Successfully!");
    Serial.print("📶 Network: ");
    Serial.println(ssid);
    Serial.print("📍 ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("📡 Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.println("=============================\n");
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("Check your WiFi credentials and try again.");
    return;
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    sendTestData();
    delay(10000);  // Send test data every 10 seconds
  } else {
    Serial.println("❌ WiFi Disconnected! Attempting to reconnect...");
    WiFi.begin(ssid, password);
    delay(5000);
  }
}

void sendTestData() {
  HTTPClient http;
  
  Serial.println("📡 Sending test data to server...");
  Serial.print("🌐 Server URL: ");
  Serial.println(serverUrl);
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create simple test JSON data (no real sensors)
  StaticJsonDocument<200> doc;
  doc["device_id"] = deviceId;
  doc["voltage"] = 230.0 + random(-5, 5);      // Fake voltage: 225-235V
  doc["current"] = 5.0 + random(-1, 1);        // Fake current: 4-6A
  doc["power"] = 1150.0 + random(-50, 50);     // Fake power: 1100-1200W
  doc["energy"] = 0.001 + (random(0, 10) * 0.0001);  // Fake energy
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.print("📤 Sending: ");
  Serial.println(jsonString);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("✅ Server Response (");
    Serial.print(httpResponseCode);
    Serial.print("): ");
    Serial.println(response);
    
    if (httpResponseCode == 201) {
      Serial.println("🎉 SUCCESS! ESP32 is connected and sending data!");
    }
  } else {
    Serial.print("❌ HTTP Error: ");
    Serial.println(httpResponseCode);
    Serial.println("💡 Check if your computer's backend server is running");
    Serial.println("💡 Check if the IP address is correct");
  }
  
  http.end();
  Serial.println("-----------------------------------\n");
}