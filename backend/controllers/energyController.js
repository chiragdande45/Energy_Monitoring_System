import pool from '../config/db.js';
import PDFDocument from 'pdfkit';

// Electricity tariff slabs (Maharashtra)
const TARIFF_SLABS = [
  { min: 0, max: 100, rate: 4.28 },
  { min: 101, max: 300, rate: 11.10 },
  { min: 301, max: 500, rate: 15.38 },
  { min: 501, max: 1000, rate: 17.68 },
  { min: 1001, max: Infinity, rate: 17.88 }
];

export const storeSensorData = async (req, res) => {
  try {
    const { device_id, voltage, current, power, energy } = req.body;
    
    // Determine data source based on request headers or user agent
    const userAgent = req.get('User-Agent') || '';
    const isSimulated = userAgent.includes('axios') || userAgent.includes('node') || userAgent.includes('Simulator');
    const dataSource = isSimulated ? 'simulated' : 'esp32';

    // Check if device exists in users table, if not create a default user
    const [existingUser] = await pool.query(
      'SELECT device_id FROM users WHERE device_id = ?',
      [device_id]
    );

    if (existingUser.length === 0) {
      // Create a default user for this device
      await pool.query(
        'INSERT INTO users (email, password, device_id) VALUES (?, ?, ?)',
        [`${device_id}@device.local`, 'default_password', device_id]
      );
      
      // Create default settings for this device
      await pool.query(
        'INSERT INTO user_settings (device_id) VALUES (?)',
        [device_id]
      );
    }

    await pool.query(
      'INSERT INTO energy_data (device_id, voltage, current, power, energy) VALUES (?, ?, ?, ?, ?)',
      [device_id, voltage, current, power, energy]
    );

    // Broadcast to connected clients via Socket.IO with data source info
    req.app.get('io').to(device_id).emit('sensorData', { 
      voltage, 
      current, 
      power, 
      energy, 
      timestamp: new Date(),
      dataSource 
    });

    res.status(201).json({ message: 'Data stored successfully', dataSource });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLiveData = async (req, res) => {
  try {
    const { device_id } = req.user;

    const [rows] = await pool.query(
      'SELECT * FROM energy_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1',
      [device_id]
    );

    if (rows.length === 0) {
      return res.json({ status: 'offline', message: 'No data available' });
    }

    const data = rows[0];
    const timeDiff = (Date.now() - new Date(data.timestamp).getTime()) / 1000;
    const status = timeDiff < 10 ? 'online' : 'offline';

    res.json({ ...data, status, lastUpdate: data.timestamp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { device_id } = req.user;
    const { period = '24h' } = req.query;

    let interval;
    switch (period) {
      case '24h': interval = 'INTERVAL 24 HOUR'; break;
      case '7d': interval = 'INTERVAL 7 DAY'; break;
      case '30d': interval = 'INTERVAL 30 DAY'; break;
      default: interval = 'INTERVAL 24 HOUR';
    }

    const [rows] = await pool.query(
      `SELECT * FROM energy_data 
       WHERE device_id = ? AND timestamp >= NOW() - ${interval}
       ORDER BY timestamp ASC`,
      [device_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const calculateCost = (units) => {
  let totalCost = 0;
  let remainingUnits = units;

  for (const slab of TARIFF_SLABS) {
    if (remainingUnits <= 0) break;

    const slabUnits = Math.min(remainingUnits, slab.max - slab.min + 1);
    totalCost += slabUnits * slab.rate;
    remainingUnits -= slabUnits;
  }

  return totalCost.toFixed(2);
};

export const getMonthlyCost = async (req, res) => {
  try {
    const { device_id } = req.user;

    const [rows] = await pool.query(
      `SELECT SUM(energy) as total_energy FROM energy_data 
       WHERE device_id = ? AND timestamp >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')`,
      [device_id]
    );

    const totalEnergy = parseFloat(rows[0].total_energy || 0);
    const estimatedCost = calculateCost(totalEnergy);

    res.json({ totalUnits: totalEnergy.toFixed(2), estimatedCost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPeakUsage = async (req, res) => {
  try {
    const { device_id } = req.user;

    const [rows] = await pool.query(
      `SELECT HOUR(timestamp) as hour, AVG(power) as avg_power
       FROM energy_data
       WHERE device_id = ? AND timestamp >= NOW() - INTERVAL 30 DAY
       GROUP BY hour
       ORDER BY avg_power DESC
       LIMIT 1`,
      [device_id]
    );

    if (rows.length === 0) {
      return res.json({ message: 'No data available' });
    }

    const peakHour = rows[0].hour;
    const peakPower = parseFloat(rows[0].avg_power).toFixed(2);

    res.json({
      peakTime: `${peakHour}:00 - ${peakHour + 1}:00`,
      peakPower: `${peakPower} W`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { device_id } = req.user;
    const { startDate, endDate } = req.query;

    const [rows] = await pool.query(
      `SELECT * FROM energy_data 
       WHERE device_id = ? AND timestamp BETWEEN ? AND ?
       ORDER BY timestamp ASC`,
      [device_id, startDate, endDate]
    );

    const totalEnergy = rows.reduce((sum, row) => sum + parseFloat(row.energy), 0);
    const avgPower = rows.reduce((sum, row) => sum + parseFloat(row.power), 0) / rows.length;
    const estimatedCost = calculateCost(totalEnergy);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=energy-report-${device_id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Energy Consumption Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Device ID: ${device_id}`);
    doc.text(`Report Period: ${startDate} to ${endDate}`);
    doc.text(`Total Energy: ${totalEnergy.toFixed(2)} kWh`);
    doc.text(`Average Power: ${avgPower.toFixed(2)} W`);
    doc.text(`Estimated Cost: ₹${estimatedCost}`);
    doc.moveDown();
    doc.fontSize(14).text('Daily Energy Consumption:');
    doc.fontSize(10);

    rows.slice(0, 30).forEach(row => {
      doc.text(`${new Date(row.timestamp).toLocaleString()}: ${row.energy} kWh`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const { device_id } = req.user;

    const [rows] = await pool.query(
      'SELECT * FROM user_settings WHERE device_id = ?',
      [device_id]
    );

    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { device_id } = req.user;
    const { power_threshold, monthly_limit, voltage_min, voltage_max } = req.body;

    await pool.query(
      `UPDATE user_settings 
       SET power_threshold = ?, monthly_limit = ?, voltage_min = ?, voltage_max = ?
       WHERE device_id = ?`,
      [power_threshold, monthly_limit, voltage_min, voltage_max, device_id]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
