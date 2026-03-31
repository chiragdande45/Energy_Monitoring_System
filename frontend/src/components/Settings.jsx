import { useState, useEffect } from 'react';
import { energy } from '../services/api';
import { useRealTimeData } from '../context/RealTimeContext';
import Sidebar from './shared/Sidebar';

export default function Settings() {
  const [localSettings, setLocalSettings] = useState({
    power_threshold: 2000,
    monthly_limit: 500,
    voltage_min: 200,
    voltage_max: 250
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Get real-time data and settings
  const { liveData, settings, setSettings, isConnected, lastUpdate, alerts } = useRealTimeData();

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await energy.updateSettings(localSettings);
      setSettings(localSettings); // Update global settings
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Sidebar with real-time status */}
      <Sidebar currentPage="settings" darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <div className="ml-64">
        {/* Real-time Alerts */}
        {alerts.length > 0 && (
          <div className="p-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg flex items-center shadow-lg animate-shake border-2 ${alert.type === 'danger' ? (darkMode ? 'bg-red-900/50 border-red-600' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300') : (darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300')}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2 ${alert.type === 'danger' ? 'bg-red-500 border-red-400' : 'bg-yellow-500 border-yellow-400'}`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`font-medium ${alert.type === 'danger' ? (darkMode ? 'text-red-300' : 'text-red-800') : (darkMode ? 'text-yellow-300' : 'text-yellow-800')}`}>{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        <header className={`shadow-sm border-b-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configure alert thresholds and monitoring parameters</p>
            </div>
            
            {/* Real-time Status Badge */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${isConnected ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Live Monitoring' : 'Offline'}
                </span>
              </div>
              
              {liveData && (
                <div className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  <span className="text-sm font-medium">
                    Current: {(Number(liveData.power) || 0).toFixed(1)}W
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Current Values Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl shadow-lg p-4 border-2 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Power</h3>
              <p className={`text-2xl font-bold ${liveData?.power > localSettings.power_threshold ? 'text-red-500' : 'text-blue-600'}`}>
                {(Number(liveData?.power) || 0).toFixed(1)} W
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Threshold: {localSettings.power_threshold}W
              </p>
            </div>
            
            <div className={`rounded-xl shadow-lg p-4 border-2 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Voltage</h3>
              <p className={`text-2xl font-bold ${(liveData?.voltage < localSettings.voltage_min || liveData?.voltage > localSettings.voltage_max) ? 'text-red-500' : 'text-green-600'}`}>
                {(Number(liveData?.voltage) || 0).toFixed(1)} V
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Range: {localSettings.voltage_min}-{localSettings.voltage_max}V
              </p>
            </div>
            
            <div className={`rounded-xl shadow-lg p-4 border-2 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current</h3>
              <p className="text-2xl font-bold text-purple-600">
                {(Number(liveData?.current) || 0).toFixed(2)} A
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Live reading
              </p>
            </div>
            
            <div className={`rounded-xl shadow-lg p-4 border-2 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Update</h3>
              <p className="text-lg font-bold text-gray-600">
                {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'No data'}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Real-time sync
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl shadow-2xl p-8 border-4 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg border-4 border-purple-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alert Configuration</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Customize your energy monitoring thresholds</p>
              </div>

              {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center border-2 ${message.includes('success') ? (darkMode ? 'bg-green-900/50 border-green-600 text-green-300' : 'bg-green-50 border-green-300 text-green-700') : (darkMode ? 'bg-red-900/50 border-red-600 text-red-300' : 'bg-red-50 border-red-300 text-red-700')}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`p-6 rounded-xl border-3 ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'}`}>
                  <label className={`block text-sm font-semibold mb-2 flex items-center ${darkMode ? 'text-blue-300' : 'text-gray-800'}`}>
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Power Alert Threshold (Watts)
                  </label>
                  <input
                    type="number"
                    value={localSettings.power_threshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, power_threshold: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-2 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>⚠️ Alert when power consumption exceeds this value</p>
                </div>

                <div className={`p-6 rounded-xl border-3 ${darkMode ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-600' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'}`}>
                  <label className={`block text-sm font-semibold mb-2 flex items-center ${darkMode ? 'text-green-300' : 'text-gray-800'}`}>
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Monthly Energy Limit (kWh)
                  </label>
                  <input
                    type="number"
                    value={localSettings.monthly_limit}
                    onChange={(e) => setLocalSettings({ ...localSettings, monthly_limit: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition border-2 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📊 Alert when monthly usage exceeds this limit</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-xl border-3 ${darkMode ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-600' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'}`}>
                    <label className={`block text-sm font-semibold mb-2 flex items-center ${darkMode ? 'text-yellow-300' : 'text-gray-800'}`}>
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      Min Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={localSettings.voltage_min}
                      onChange={(e) => setLocalSettings({ ...localSettings, voltage_min: parseFloat(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition border-2 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>

                  <div className={`p-6 rounded-xl border-3 ${darkMode ? 'bg-gradient-to-br from-red-900/30 to-pink-900/30 border-red-600' : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300'}`}>
                    <label className={`block text-sm font-semibold mb-2 flex items-center ${darkMode ? 'text-red-300' : 'text-gray-800'}`}>
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Max Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={localSettings.voltage_max}
                      onChange={(e) => setLocalSettings({ ...localSettings, voltage_max: parseFloat(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition border-2 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-3 border-purple-400"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Settings
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
