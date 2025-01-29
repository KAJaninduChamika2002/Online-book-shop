const router = require('express').Router();
const { pool } = require('../config/db');
const { protect } = require('../middleware/auth.middleware');

router.get('/dashboard', protect, async (req, res) => {
  try {
    const [[{ order_count }]] = await pool.query('SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?', [req.user.id]);
    const [[{ wishlist_count }]] = await pool.query('SELECT COUNT(*) as wishlist_count FROM wishlist WHERE user_id = ?', [req.user.id]);
    const [[{ total_spent }]] = await pool.query("SELECT COALESCE(SUM(total),0) as total_spent FROM orders WHERE user_id = ? AND payment_status='paid'", [req.user.id]);
    res.json({ success: true, stats: { order_count, wishlist_count, total_spent } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    await pool.query('INSERT IGNORE INTO newsletter (email) VALUES (?)', [email]);
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
