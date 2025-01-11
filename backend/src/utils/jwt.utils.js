const jwt = require('jsonwebtoken');

exports.generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.generateOrderNumber = () =>
  `TS${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
