const router = require('express').Router();
const { pool } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const { position = 'hero' } = req.query;
    const [banners] = await pool.query(
      'SELECT * FROM banners WHERE is_active = 1 AND position = ? ORDER BY sort_order',
      [position]
    );
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, image, link, button_text, position, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO banners (title, subtitle, image, link, button_text, position, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, image, link, button_text, position || 'hero', sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, image, link, button_text, sort_order, is_active } = req.body;
    await pool.query(
      'UPDATE banners SET title=?, subtitle=?, image=?, link=?, button_text=?, sort_order=?, is_active=? WHERE id=?',
      [title, subtitle, image, link, button_text, sort_order, is_active, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
