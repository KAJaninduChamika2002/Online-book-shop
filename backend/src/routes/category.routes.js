const router = require('express').Router();
const { pool } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      WHERE c.is_active = 1 GROUP BY c.id ORDER BY c.sort_order
    `);
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, image, parent_id, sort_order } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, image, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description, image, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, image, sort_order, is_active } = req.body;
    await pool.query(
      'UPDATE categories SET name = ?, description = ?, image = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, description, image, sort_order, is_active, req.params.id]
    );
    res.json({ success: true, message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE categories SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
