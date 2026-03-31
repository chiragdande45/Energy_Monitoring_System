import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LivePowerChart({ data, darkMode, dataSource }) {
  // Show message when no data is available
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Real-Time Power Consumption
        </h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
              <svg className={`w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Waiting for real-time data...
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
              Chart will appear when power data is received
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getDataSourceBadge = () => {
    if (dataSource === 'esp32') {
      return <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">ESP32 Live</span>;
    } else if (dataSource === 'simulated') {
      return <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Simulated</span>;
    }
    return null;
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 border-3 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Real-Time Power Consumption
        {getDataSourceBadge()}
        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
          {data.length} data points
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
          <XAxis 
            dataKey="time" 
            stroke={darkMode ? '#94a3b8' : '#6b7280'}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke={darkMode ? '#94a3b8' : '#6b7280'}
            style={{ fontSize: '12px' }}
            label={{ value: 'Power (W)', angle: -90, position: 'insideLeft', fill: darkMode ? '#94a3b8' : '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
              border: darkMode ? '2px solid #475569' : '2px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: darkMode ? '#e2e8f0' : '#1f2937'
            }}
            formatter={(value) => [`${Number(value).toFixed(2)} W`, 'Power']}
          />
          <Legend wrapperStyle={{ color: darkMode ? '#e2e8f0' : '#1f2937' }} />
          <Line 
            type="monotone" 
            dataKey="power" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            fill="url(#colorPower)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}