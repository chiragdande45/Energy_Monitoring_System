import { useState, useEffect } from 'react';
import { useRealTimeData } from '../context/RealTimeContext';
import Sidebar from './shared/Sidebar';
import LivePowerChart from './charts/LivePowerChart';

export default function Dashboard() {
  const { 
    liveData, 
    powerHistory, 
    monthlyCost, 
    peakUsage, 
    alerts, 
    settings,
    dataSource,
    lastUpdate
  } = useRealTimeData();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);

  const getEnergySavingTips = () => {
    if (!peakUsage) return [];
    
    return [
      { icon: '💡', tip: 'Peak usage detected during evening hours. Consider using high-power appliances during off-peak times.' },
      { icon: '🌟', tip: 'Your monthly consumption is trending high. Switch to energy-efficient LED bulbs.' },
      { icon: '🔌', tip: 'Unplug devices when not in use to reduce standby power consumption.' }
    ];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Sidebar */}
      <Sidebar currentPage="dashboard" darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="p-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex items-center shadow-lg animate-shake border-3 ${alert.type === 'danger' ? (darkMode ? 'bg-red-900/50 border-red-600' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300') : (darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300')}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 ${alert.type === 'danger' ? 'bg-red-500 border-red-400' : 'bg-yellow-500 border-yellow-400'}`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className={`font-medium ${alert.type === 'danger' ? (darkMode ? 'text-red-300' : 'text-red-800') : (darkMode ? 'text-yellow-300' : 'text-yellow-800')}`}>{alert.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Voltage Card */}
            <div className="group relative rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 card-hover overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">VOLTAGE</span>
                </div>
                <p className="text-5xl font-bold text-white mb-2 tracking-tight">{liveData?.voltage || 0}</p>
                <p className="text-sm font-medium text-white/80">Volts (V)</p>
              </div>
            </div>

            {/* Current Card */}
            <div className="group relative rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 card-hover overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">CURRENT</span>
                </div>
                <p className="text-5xl font-bold text-white mb-2 tracking-tight">{liveData?.current || 0}</p>
                <p className="text-sm font-medium text-white/80">Amperes (A)</p>
              </div>
            </div>

            {/* Power Card */}
            <div className="group relative rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 card-hover overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">POWER</span>
                </div>
                <p className="text-5xl font-bold text-white mb-2 tracking-tight">{liveData?.power || 0}</p>
                <p className="text-sm font-medium text-white/80">Watts (W)</p>
              </div>
            </div>

            {/* Energy Card */}
            <div className="group relative rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 card-hover overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">ENERGY</span>
                </div>
                <p className="text-5xl font-bold text-white mb-2 tracking-tight">{liveData?.energy || 0}</p>
                <p className="text-sm font-medium text-white/80">Kilowatt-hour (kWh)</p>
              </div>
            </div>
          </div>

          {/* Device Status & Monthly Cost */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Device Status
              </h3>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-3 ${
                  dataSource === 'esp32' ? 'bg-green-100 border-green-400 animate-pulse-glow' : 
                  dataSource === 'simulated' ? 'bg-yellow-100 border-yellow-400' : 
                  'bg-red-100 border-red-400'
                }`}>
                  <span className="text-3xl">
                    {dataSource === 'esp32' ? '🟢' : dataSource === 'simulated' ? '🟡' : '🔴'}
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    dataSource === 'esp32' ? 'text-green-600' : 
                    dataSource === 'simulated' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {dataSource === 'esp32' ? 'ESP32 Online' : 
                     dataSource === 'simulated' ? 'Simulated Data' : 
                     'Offline'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last Update: {lastUpdate ? new Date(lastUpdate).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-2xl shadow-2xl p-6 card-hover overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-300/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-3 border border-white/30 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Monthly Cost Estimate
                </h3>
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-6xl font-bold text-white tracking-tight">₹{monthlyCost?.estimatedCost || 0}</span>
                  <span className="text-2xl font-semibold text-white/80">INR</span>
                </div>
                <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30">
                  <span className="text-sm font-semibold text-white/90">Total Units</span>
                  <span className="text-xl font-bold text-white">{monthlyCost?.totalUnits || 0} kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chart */}
          <div className="mb-6">
            <LivePowerChart data={powerHistory} darkMode={darkMode} dataSource={dataSource} />
          </div>

          {/* Peak Usage & Energy Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Peak Usage Analytics
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${darkMode ? 'bg-purple-900/30 border-purple-600' : 'bg-purple-50 border-purple-200'}`}>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Peak Time</span>
                  <span className="text-purple-600 font-bold">{peakUsage?.peakTime || 'N/A'}</span>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${darkMode ? 'bg-purple-900/30 border-purple-600' : 'bg-purple-50 border-purple-200'}`}>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Peak Power</span>
                  <span className="text-purple-600 font-bold">{peakUsage?.peakPower || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Energy Saving Tips
              </h3>
              <div className="space-y-3">
                {getEnergySavingTips().map((item, idx) => (
                  <div key={idx} className={`flex items-start p-4 rounded-xl transition border-2 ${darkMode ? 'bg-green-900/30 border-green-600 hover:bg-green-900/50' : 'bg-green-50 border-green-200 hover:bg-green-100'}`}>
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
