import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { email, password, device_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password, device_id) VALUES (?, ?, ?)',
      [email, hashedPassword, device_id]
    );

    await pool.query(
      'INSERT INTO user_settings (device_id) VALUES (?)',
      [device_id]
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: result.insertId, email, device_id } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, device_id: user.device_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, device_id: user.device_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
