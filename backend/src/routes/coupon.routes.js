const router = require('express').Router();
const { pool } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/validate', protect, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const [[coupon]] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expiry IS NULL OR expiry >= CURDATE()) AND (usage_limit IS NULL OR used_count < usage_limit)',
      [code]
    );
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    if (subtotal < coupon.min_order) return res.status(400).json({ success: false, message: `Minimum order of LKR ${coupon.min_order} required` });

    let discount = coupon.type === 'percentage' ? (subtotal * coupon.discount / 100) : coupon.discount;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);

    res.json({ success: true, coupon: { ...coupon, calculated_discount: discount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [coupons] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, type, discount, min_order, max_discount, usage_limit, expiry } = req.body;
    const [result] = await pool.query(
      'INSERT INTO coupons (code, type, discount, min_order, max_discount, usage_limit, expiry) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), type, discount, min_order || 0, max_discount || null, usage_limit || null, expiry || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
