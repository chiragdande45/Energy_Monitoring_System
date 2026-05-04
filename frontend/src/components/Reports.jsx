import { useState } from 'react';
import { energy } from '../services/api';
import { useRealTimeData } from '../context/RealTimeContext';
import Sidebar from './shared/Sidebar';

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Get real-time data
  const { liveData, monthlyCost, isConnected, lastUpdate, alerts, dataSource } = useRealTimeData();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setSuccess(false);
    try {
      const response = await energy.generateReport(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `energy-report-${startDate}-to-${endDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Sidebar with real-time status */}
      <Sidebar currentPage="reports" darkMode={darkMode} setDarkMode={setDarkMode} />

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
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Energy Reports</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generate comprehensive energy consumption reports</p>
            </div>
            
            {/* Real-time Status Badge */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${dataSource === 'esp32' ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${dataSource === 'esp32' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {dataSource === 'esp32' ? 'ESP32 Online' : 'Offline'}
                </span>
              </div>
              
              {liveData && (
                <div className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  <span className="text-sm font-medium">
                    {(Number(liveData.power) || 0).toFixed(1)}W • {(Number(liveData.voltage) || 0).toFixed(1)}V
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Real-time Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current Power</h3>
              <p className="text-3xl font-bold text-blue-600">{(Number(liveData?.power) || 0).toFixed(1)} W</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lastUpdate ? `Updated ${new Date(lastUpdate).toLocaleTimeString()}` : 'No recent data'}
              </p>
            </div>
            
            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Monthly Cost</h3>
              <p className="text-3xl font-bold text-green-600">₹{monthlyCost?.estimatedCost || '0.00'}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {monthlyCost?.totalUnits || '0.0'} kWh consumed
              </p>
            </div>
            
            <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Device Status</h3>
              <p className={`text-3xl font-bold ${dataSource === 'esp32' ? 'text-green-600' : 'text-red-600'}`}>
                {dataSource === 'esp32' ? 'Online' : 'Offline'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ESP32_001 • {(Number(liveData?.voltage) || 0).toFixed(1)}V
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl shadow-xl p-8 border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Generate PDF Report</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select a date range to generate your energy consumption report</p>
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Report downloaded successfully!
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Report...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate & Download PDF
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Report Includes:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Total energy consumption
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Average power usage
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Estimated electricity cost
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Daily energy breakdown
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Usage trends & patterns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
