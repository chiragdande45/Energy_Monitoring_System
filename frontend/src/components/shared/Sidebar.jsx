import { useRealTimeData } from '../../context/RealTimeContext';

export default function Sidebar({ currentPage, darkMode, setDarkMode }) {
  const { liveData, isConnected, lastUpdate, dataSource } = useRealTimeData();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getDeviceStatus = () => {
    if (!liveData) return { status: 'offline', color: 'bg-red-500', text: 'No Data' };
    
    const timeDiff = lastUpdate ? (Date.now() - new Date(lastUpdate).getTime()) / 1000 : 999;
    
    // Check if data is recent (within 10 seconds)
    if (timeDiff < 10) {
      if (dataSource === 'esp32') {
        return { status: 'online', color: 'bg-green-500', text: 'ESP32 Online' };
      } else if (dataSource === 'simulated') {
        return { status: 'simulated', color: 'bg-yellow-500', text: 'Simulated Data' };
      } else {
        return { status: 'unknown', color: 'bg-blue-500', text: 'Data Source Unknown' };
      }
    } else {
      return { status: 'offline', color: 'bg-red-500', text: 'Offline' };
    }
  };

  const deviceStatus = getDeviceStatus();

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen w-64 animated-gradient shadow-2xl border-r-4 border-indigo-400`}>
      <div className="h-full px-4 py-6 overflow-y-auto">
        <div className="flex items-center mb-8 px-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 border-2 border-white/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">EnergyHub</span>
        </div>

        {/* Real-time Status Indicator */}
        <div className="mb-6 p-3 bg-white/10 rounded-xl border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">Device Status</span>
            <div className={`w-3 h-3 rounded-full ${deviceStatus.color} ${isConnected ? 'animate-pulse' : ''}`}></div>
          </div>
          <div className="text-white text-xs">
            <div>{deviceStatus.text}</div>
            {liveData && (
              <div className="mt-1 text-white/70">
                {(Number(liveData.power) || 0).toFixed(1)}W • {(Number(liveData.voltage) || 0).toFixed(1)}V
              </div>
            )}
            {lastUpdate && (
              <div className="text-white/60 text-xs mt-1">
                Updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-2">
          <a 
            href="/dashboard" 
            className={`flex items-center px-4 py-3 text-white rounded-xl transition border-2 ${
              currentPage === 'dashboard' 
                ? 'bg-white/20 border-white/40' 
                : 'text-white/80 border-transparent hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
            {isConnected && currentPage === 'dashboard' && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </a>
          
          <a 
            href="/reports" 
            className={`flex items-center px-4 py-3 text-white rounded-xl transition border-2 ${
              currentPage === 'reports' 
                ? 'bg-white/20 border-white/40' 
                : 'text-white/80 border-transparent hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
            {isConnected && currentPage === 'reports' && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </a>
          
          <a 
            href="/settings" 
            className={`flex items-center px-4 py-3 text-white rounded-xl transition border-2 ${
              currentPage === 'settings' 
                ? 'bg-white/20 border-white/40' 
                : 'text-white/80 border-transparent hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
            {isConnected && currentPage === 'settings' && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              if (!darkMode) {
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              }
            }}
            className="flex items-center justify-between w-full px-4 py-3 text-white/80 rounded-xl hover:bg-white/10 transition border-2 border-transparent hover:border-white/20 mt-2"
          >
            <div className="flex items-center">
              {darkMode ? (
                <svg className="w-5 h-5 mr-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-400'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-3 text-white/80 rounded-xl hover:bg-white/10 transition border-2 border-transparent hover:border-white/20"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}