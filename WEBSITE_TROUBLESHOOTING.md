# 🌐 Website Troubleshooting Guide

## ✅ **Current Status: WORKING**
- ✅ Backend API: Running on port 5000
- ✅ Frontend: Running on port 5173
- ✅ Database: Connected and active
- ✅ ESP32 Endpoint: Ready to receive data

## 🌐 **Access Your Website:**

### **Main Dashboard:**
```
http://localhost:5173
```

### **Direct Login Page:**
```
http://localhost:5173/login
```

### **Your Login Credentials:**
- **Email:** chirag@gmail.com
- **Password:** password123
- **Device ID:** ESP32_001

## 🔧 **If Website Still Not Opening:**

### **1. Check Browser:**
- Try different browser (Chrome, Firefox, Edge)
- Clear browser cache (Ctrl+F5)
- Disable browser extensions
- Try incognito/private mode

### **2. Check Firewall:**
```bash
# Windows Firewall might be blocking
# Allow Node.js through Windows Firewall
```

### **3. Check Ports:**
```bash
# Check if ports are in use
netstat -ano | findstr :5173
netstat -ano | findstr :5000
```

### **4. Restart Services:**
```bash
# Stop and restart both services
# Backend: Ctrl+C in backend terminal, then npm run dev
# Frontend: Ctrl+C in frontend terminal, then npm run dev
```

## 🌐 **Alternative Access Methods:**

### **Backend API Direct:**
```
http://localhost:5000/api/sensor-data
```

### **Test Backend:**
```bash
curl http://localhost:5000/api/sensor-data
```

## 📱 **Mobile/Other Device Access:**

### **Find Your Computer's IP:**
```bash
ipconfig
```

### **Access from Phone/Tablet:**
```
http://YOUR_COMPUTER_IP:5173
# Example: http://192.168.1.100:5173
```

## 🚨 **Common Issues & Solutions:**

### **Issue 1: "This site can't be reached"**
**Solution:**
- Check if services are running
- Try http://127.0.0.1:5173 instead
- Restart your computer's network adapter

### **Issue 2: "Connection refused"**
**Solution:**
- Backend not running → Start with `npm run dev` in backend folder
- Frontend not running → Start with `npm run dev` in frontend folder

### **Issue 3: "Page loads but shows errors"**
**Solution:**
- Check browser console (F12)
- Ensure backend is running on port 5000
- Check database connection

### **Issue 4: "Login doesn't work"**
**Solution:**
- Use exact credentials: chirag@gmail.com / password123
- Check if backend database is connected
- Try registering a new account

## 🎯 **Quick Test Steps:**

### **Step 1: Test Backend**
```
Open: http://localhost:5000/api/sensor-data
Should show: Method not allowed (this is correct)
```

### **Step 2: Test Frontend**
```
Open: http://localhost:5173
Should show: Login/Register page
```

### **Step 3: Login**
```
Email: chirag@gmail.com
Password: password123
Should redirect to dashboard
```

### **Step 4: Check Dashboard**
```
Should show: Real-time energy monitoring interface
Device status: Online (if ESP32 simulator running)
```

## 🔄 **Restart Everything:**

### **Complete Restart Sequence:**
1. Close all terminals (Ctrl+C)
2. Open new terminal in project folder
3. Start backend: `cd backend && npm run dev`
4. Open another terminal
5. Start frontend: `cd frontend && npm run dev`
6. Wait 10 seconds
7. Open browser: http://localhost:5173

## 📞 **Still Not Working?**

### **Check These:**
- ✅ Node.js installed and working
- ✅ npm packages installed (run `npm install` in both folders)
- ✅ MySQL running and accessible
- ✅ No other applications using ports 5000/5173
- ✅ Antivirus not blocking Node.js
- ✅ Windows Defender firewall settings

### **Get Detailed Status:**
```bash
# Run this command for detailed diagnostics
node check-status.js
```

## 🎉 **Success Indicators:**
- ✅ Login page loads at http://localhost:5173
- ✅ Can login with chirag@gmail.com / password123
- ✅ Dashboard shows energy monitoring interface
- ✅ Device status shows "Online" or "Offline"
- ✅ Real-time data updates (if ESP32 connected)