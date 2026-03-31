import { createContext, useContext, useEffect, useState } from 'react';
import { connectSocket } from '../services/socket';
import { energy } from '../services/api';

const RealTimeContext = createContext();

export const useRealTimeData = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider = ({ children }) => {
  const [liveData, setLiveData] = useState(null);
  const [powerHistory, setPowerHistory] = useState([]);
  const [monthlyCost, setMonthlyCost] = useState(null);
  const [peakUsage, setPeakUsage] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dataSource, setDataSource] = useState('unknown');

  useEffect(() => {
    const deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      console.log('No device ID found, skipping socket connection');
      return;
    }

    let socket;
    
    try {
      socket = connectSocket(deviceId);

      // Initial data fetch
      fetchInitialData();

      // Socket event listeners
      socket.on('connect', () => {
        console.log('🔌 Real-time connection established');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Real-time connection lost');
        setIsConnected(false);
      });

      socket.on('sensorData', (data) => {
        console.log('📡 Real-time data received:', data);
        setLiveData(data);
        setLastUpdate(new Date());
        setDataSource(data.dataSource || 'unknown');
        
        // Update power history for charts - ensure power is a number
        setPowerHistory((prev) => {
          const newData = [...prev, { 
            time: new Date(data.timestamp).toLocaleTimeString(), 
            power: Number(data.power) || 0
          }];
          return newData.slice(-30); // Keep last 30 readings (30 seconds of data)
        });
        
        // Check for alerts
        checkAlerts(data);
      });

    } catch (error) {
      console.error('Socket connection error:', error);
    }

    // Periodic data refresh (every 5 seconds as backup)
    const intervalId = setInterval(() => {
      fetchInitialData();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [liveResponse, costResponse, peakResponse, settingsResponse] = await Promise.allSettled([
        energy.getLiveData(),
        energy.getMonthlyCost(),
        energy.getPeakUsage(),
        energy.getSettings()
      ]);

      if (liveResponse.status === 'fulfilled' && liveResponse.value?.data) {
        const liveDataResponse = liveResponse.value.data;
        setLiveData(liveDataResponse);
        
        // Add data point to chart from API call (as backup when WebSocket isn't working)
        if (liveDataResponse.power !== undefined) {
          setPowerHistory((prev) => {
            const newData = [...prev, {
              time: new Date().toLocaleTimeString(),
              power: Number(liveDataResponse.power) || 0
            }];
            return newData.slice(-30); // Keep last 30 readings
          });
        }
      }
      if (costResponse.status === 'fulfilled' && costResponse.value?.data) {
        setMonthlyCost(costResponse.value.data);
      }
      if (peakResponse.status === 'fulfilled' && peakResponse.value?.data) {
        setPeakUsage(peakResponse.value.data);
      }
      if (settingsResponse.status === 'fulfilled' && settingsResponse.value?.data) {
        setSettings(settingsResponse.value.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const checkAlerts = (data) => {
    const newAlerts = [];
    
    if (settings) {
      if (data.power > settings.power_threshold) {
        newAlerts.push({ 
          type: 'warning', 
          message: `High power consumption: ${data.power}W`,
          timestamp: new Date()
        });
      }
      if (data.voltage < settings.voltage_min || data.voltage > settings.voltage_max) {
        newAlerts.push({ 
          type: 'danger', 
          message: `Voltage out of range: ${data.voltage}V`,
          timestamp: new Date()
        });
      }
    }

    setAlerts(newAlerts);
    
    // Auto-clear alerts after 10 seconds
    if (newAlerts.length > 0) {
      setTimeout(() => setAlerts([]), 10000);
    }
  };

  const refreshData = () => {
    fetchInitialData();
  };

  const value = {
    // Real-time data
    liveData,
    powerHistory,
    monthlyCost,
    peakUsage,
    alerts,
    settings,
    
    // Connection status
    isConnected,
    lastUpdate,
    dataSource,
    
    // Actions
    refreshData,
    
    // Setters for manual updates
    setSettings,
    setMonthlyCost,
    setPeakUsage
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};