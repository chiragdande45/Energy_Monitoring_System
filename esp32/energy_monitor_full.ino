/*
 * ESP32 Energy Monitor - Full Functional Code
 * Supports: ZMPT101B (Voltage), ACS712 (Current), Real-time monitoring
 * Compatible with your IoT Energy Monitoring Platform
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <EEPROM.h>

// ========== CONFIGURATION ==========
// WiFi Settings
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server Settings  
const char* serverUrl = "http://192.168.137.1:5000/api/sensor-data";
const char* deviceId = "ESP32_001";

// Hardware Pins
const int VOLTAGE_PIN = 34;    // ZMPT101B voltage sensor (ADC1_CH6)
const int CURRENT_PIN = 35;    // ACS712 current sensor (ADC1_CH7)
const int LED_PIN = 2;         // Built-in LED for status
const int RELAY_PIN = 4;       // Optional relay control

// Sensor Calibration (adjust based on your sensors)
const float VOLTAGE_CALIBRATION = 234.26;  // ZMPT101B calibration
const float CURRENT_CALIBRATION = 0.066;   // ACS712-30A: 66mV/A
const float VOLTAGE_OFFSET = 1.65;         // ACS712 offset voltage
const int SAMPLES = 1000;                  // Number of samples for RMS calculation

// Timing
const unsigned long SEND_INTERVAL = 1000;  // Send data every 1 second
const unsigned long DISPLAY_INTERVAL = 1000; // Update display every 1 second

// ========== GLOBAL VARIABLES ==========
float voltage = 0.0;
float current = 0.0;
float power = 0.0;
float energy = 0.0;
float totalEnergy = 0.0;
unsigned long lastSendTime = 0;
unsigned long lastDisplayTime = 0;
unsigned long lastEnergyTime = 0;
bool wifiConnected = false;
bool serverConnected = false;

WebServer server(80);  // Web server for configuration
// ========== SETUP FUNCTION ==========
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(RELAY_PIN, LOW);
  
  // Initialize EEPROM for energy storage
  EEPROM.begin(512);
  loadTotalEnergy();
  
  Serial.println("\n" + String("=").repeat(50));
  Serial.println("🔌 ESP32 ENERGY MONITOR STARTING");
  Serial.println("Device ID: " + String(deviceId));
  Serial.println("Version: 2.0 - Full Functional");
  Serial.println(String("=").repeat(50));
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup web server for configuration
  setupWebServer();
  
  // Initialize timing
  lastEnergyTime = millis();
  
  Serial.println("✅ Setup complete! Starting energy monitoring...\n");
}

// ========== MAIN LOOP ==========
void loop() {
  unsigned long currentTime = millis();
  
  // Handle web server requests
  server.handleClient();
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiConnected) {
      Serial.println("❌ WiFi disconnected! Attempting reconnection...");
      wifiConnected = false;
      digitalWrite(LED_PIN, LOW);
    }
    connectToWiFi();
    return;
  }
  
  // Read sensors continuously
  readSensors();
  
  // Calculate energy consumption
  calculateEnergy(currentTime);
  
  // Display readings every second
  if (currentTime - lastDisplayTime >= DISPLAY_INTERVAL) {
    displayReadings();
    lastDisplayTime = currentTime;
  }
  
  // Send data to server every 5 seconds
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    sendDataToServer();
    lastSendTime = currentTime;
  }
  
  // Blink LED to show activity
  blinkStatusLED();
  
  delay(10);  // Small delay for stability
}
// ========== WIFI CONNECTION ==========
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
    digitalWrite(LED_PIN, HIGH);
    
    Serial.println("\n✅ WiFi Connected Successfully!");
    Serial.println("📍 ESP32 IP Address: " + WiFi.localIP().toString());
    Serial.println("📶 Signal Strength: " + String(WiFi.RSSI()) + " dBm");
    Serial.println("🌐 Web Interface: http://" + WiFi.localIP().toString());
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("💡 Check your WiFi credentials and signal strength");
    wifiConnected = false;
  }
}

// ========== SENSOR READING ==========
void readSensors() {
  // Read voltage using RMS calculation for AC
  voltage = readVoltageRMS();
  
  // Read current using RMS calculation for AC
  current = readCurrentRMS();
  
  // Calculate power (P = V × I × cos(φ), assuming cos(φ) ≈ 1 for resistive loads)
  power = voltage * current;
  
  // Ensure values are within reasonable ranges
  if (voltage < 0 || voltage > 300) voltage = 0;
  if (current < 0 || current > 50) current = 0;
  if (power < 0) power = 0;
}

// ========== VOLTAGE RMS CALCULATION ==========
float readVoltageRMS() {
  float sum = 0;
  int validSamples = 0;
  
  for (int i = 0; i < SAMPLES; i++) {
    int rawValue = analogRead(VOLTAGE_PIN);
    float voltage = (rawValue * 3.3) / 4095.0;  // Convert to voltage
    
    // Remove DC offset and apply calibration
    float acVoltage = (voltage - 1.65) * VOLTAGE_CALIBRATION;
    
    sum += acVoltage * acVoltage;
    validSamples++;
    
    delayMicroseconds(100);  // Small delay between samples
  }
  
  if (validSamples > 0) {
    float rms = sqrt(sum / validSamples);
    return abs(rms);  // Return absolute value
  }
  return 0;
}

// ========== CURRENT RMS CALCULATION ==========
float readCurrentRMS() {
  float sum = 0;
  int validSamples = 0;
  
  for (int i = 0; i < SAMPLES; i++) {
    int rawValue = analogRead(CURRENT_PIN);
    float voltage = (rawValue * 3.3) / 4095.0;  // Convert to voltage
    
    // Calculate current: (V - offset) / sensitivity
    float current = (voltage - VOLTAGE_OFFSET) / CURRENT_CALIBRATION;
    
    sum += current * current;
    validSamples++;
    
    delayMicroseconds(100);  // Small delay between samples
  }
  
  if (validSamples > 0) {
    float rms = sqrt(sum / validSamples);
    return abs(rms);  // Return absolute value
  }
  return 0;
}
// ========== ENERGY CALCULATION ==========
void calculateEnergy(unsigned long currentTime) {
  if (lastEnergyTime > 0) {
    float timeHours = (currentTime - lastEnergyTime) / 3600000.0;  // Convert ms to hours
    energy = power * timeHours;  // Energy in Wh
    totalEnergy += energy;       // Accumulate total energy
    
    // Save total energy to EEPROM every 10 readings
    static int saveCounter = 0;
    if (++saveCounter >= 10) {
      saveTotalEnergy();
      saveCounter = 0;
    }
  }
  lastEnergyTime = currentTime;
}

// ========== DATA TRANSMISSION ==========
void sendDataToServer() {
  if (!wifiConnected) return;
  
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);  // 10 second timeout
  
  // Create JSON payload
  StaticJsonDocument<300> doc;
  doc["device_id"] = deviceId;
  doc["voltage"] = round(voltage * 100) / 100.0;      // Round to 2 decimal places
  doc["current"] = round(current * 100) / 100.0;
  doc["power"] = round(power * 100) / 100.0;
  doc["energy"] = round(energy * 10000) / 10000.0;    // Round to 4 decimal places
  doc["total_energy"] = round(totalEnergy * 100) / 100.0;
  doc["timestamp"] = WiFi.getTime();
  doc["rssi"] = WiFi.RSSI();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("📡 Sending data to server...");
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    
    if (httpResponseCode == 201) {
      Serial.println("✅ Data sent successfully!");
      serverConnected = true;
    } else {
      Serial.println("⚠️  Server response: " + String(httpResponseCode));
    }
  } else {
    Serial.println("❌ HTTP Error: " + String(httpResponseCode));
    Serial.println("💡 Check server connection and IP address");
    serverConnected = false;
  }
  
  http.end();
}

// ========== DISPLAY FUNCTIONS ==========
void displayReadings() {
  Serial.println("\n" + String("-").repeat(40));
  Serial.println("⚡ ENERGY MONITOR READINGS");
  Serial.println(String("-").repeat(40));
  Serial.printf("🔌 Voltage:      %.2f V\n", voltage);
  Serial.printf("⚡ Current:      %.2f A\n", current);
  Serial.printf("💡 Power:        %.2f W\n", power);
  Serial.printf("📊 Energy:       %.4f kWh\n", energy);
  Serial.printf("📈 Total Energy: %.2f kWh\n", totalEnergy);
  Serial.printf("📶 WiFi RSSI:    %d dBm\n", WiFi.RSSI());
  Serial.printf("🌐 Server:       %s\n", serverConnected ? "Connected" : "Disconnected");
  Serial.printf("⏰ Uptime:       %lu seconds\n", millis() / 1000);
  Serial.println(String("-").repeat(40));
}

void blinkStatusLED() {
  static unsigned long lastBlink = 0;
  static bool ledState = false;
  
  if (millis() - lastBlink > (wifiConnected ? 1000 : 200)) {
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
    lastBlink = millis();
  }
}
// ========== EEPROM FUNCTIONS ==========
void saveTotalEnergy() {
  EEPROM.put(0, totalEnergy);
  EEPROM.commit();
}

void loadTotalEnergy() {
  EEPROM.get(0, totalEnergy);
  if (isnan(totalEnergy) || totalEnergy < 0) {
    totalEnergy = 0.0;  // Reset if invalid
  }
  Serial.println("💾 Loaded total energy: " + String(totalEnergy) + " kWh");
}

// ========== WEB SERVER SETUP ==========
void setupWebServer() {
  // Root page - Energy Monitor Dashboard
  server.on("/", []() {
    String html = "<!DOCTYPE html><html><head>";
    html += "<title>ESP32 Energy Monitor</title>";
    html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
    html += "<style>body{font-family:Arial;margin:20px;background:#f0f0f0}";
    html += ".card{background:white;padding:20px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1)}";
    html += ".value{font-size:24px;font-weight:bold;color:#2196F3}";
    html += ".unit{color:#666;font-size:14px}";
    html += ".status{padding:5px 10px;border-radius:5px;color:white}";
    html += ".online{background:#4CAF50}.offline{background:#f44336}";
    html += "</style></head><body>";
    
    html += "<h1>🔌 ESP32 Energy Monitor</h1>";
    html += "<div class='card'><h3>📊 Live Readings</h3>";
    html += "<p>Voltage: <span class='value'>" + String(voltage, 2) + "</span> <span class='unit'>V</span></p>";
    html += "<p>Current: <span class='value'>" + String(current, 2) + "</span> <span class='unit'>A</span></p>";
    html += "<p>Power: <span class='value'>" + String(power, 2) + "</span> <span class='unit'>W</span></p>";
    html += "<p>Energy: <span class='value'>" + String(energy, 4) + "</span> <span class='unit'>kWh</span></p>";
    html += "<p>Total Energy: <span class='value'>" + String(totalEnergy, 2) + "</span> <span class='unit'>kWh</span></p>";
    html += "</div>";
    
    html += "<div class='card'><h3>🌐 Connection Status</h3>";
    html += "<p>WiFi: <span class='status " + String(wifiConnected ? "online'>Connected" : "offline'>Disconnected") + "</span></p>";
    html += "<p>Server: <span class='status " + String(serverConnected ? "online'>Connected" : "offline'>Disconnected") + "</span></p>";
    html += "<p>IP Address: " + WiFi.localIP().toString() + "</p>";
    html += "<p>Signal: " + String(WiFi.RSSI()) + " dBm</p>";
    html += "</div>";
    
    html += "<div class='card'><h3>⚙️ Device Info</h3>";
    html += "<p>Device ID: " + String(deviceId) + "</p>";
    html += "<p>Uptime: " + String(millis() / 1000) + " seconds</p>";
    html += "<p>Free Heap: " + String(ESP.getFreeHeap()) + " bytes</p>";
    html += "</div>";
    
    html += "<script>setTimeout(function(){location.reload()},5000);</script>";  // Auto refresh
    html += "</body></html>";
    
    server.send(200, "text/html", html);
  });
  
  // API endpoint for JSON data
  server.on("/api/data", []() {
    StaticJsonDocument<300> doc;
    doc["device_id"] = deviceId;
    doc["voltage"] = voltage;
    doc["current"] = current;
    doc["power"] = power;
    doc["energy"] = energy;
    doc["total_energy"] = totalEnergy;
    doc["wifi_connected"] = wifiConnected;
    doc["server_connected"] = serverConnected;
    doc["rssi"] = WiFi.RSSI();
    doc["uptime"] = millis() / 1000;
    doc["free_heap"] = ESP.getFreeHeap();
    
    String jsonString;
    serializeJson(doc, jsonString);
    server.send(200, "application/json", jsonString);
  });
  
  // Reset total energy
  server.on("/reset", []() {
    totalEnergy = 0.0;
    saveTotalEnergy();
    server.send(200, "text/plain", "Total energy reset to 0");
  });
  
  server.begin();
  Serial.println("🌐 Web server started on port 80");
}