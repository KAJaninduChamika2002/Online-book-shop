const router = require('express').Router();
const { pool } = require('../config/db');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT w.id, p.id as product_id, p.name, p.slug, p.price, p.sale_price, p.thumbnail, p.stock
      FROM wishlist w JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? ORDER BY w.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:productId', protect, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    if (existing.length) {
      await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
      return res.json({ success: true, wishlisted: false });
    }
    await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, req.params.productId]);
    res.json({ success: true, wishlisted: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:productId', protect, async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
