const { pool } = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const [[{ total_orders }]] = await pool.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await pool.query("SELECT COALESCE(SUM(total),0) as total_revenue FROM orders WHERE payment_status='paid'");
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) as total_users FROM users WHERE role='user'");
    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) as total_products FROM products WHERE is_active=1');
    const [[{ pending_orders }]] = await pool.query("SELECT COUNT(*) as pending_orders FROM orders WHERE status='pending'");
    const [[{ low_stock }]] = await pool.query('SELECT COUNT(*) as low_stock FROM products WHERE stock <= 5 AND is_active=1');

    const [recent_orders] = await pool.query(`
      SELECT o.id, o.order_number, o.total, o.status, o.created_at, u.name as user_name
      FROM orders o LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 5
    `);

    const [monthly_revenue] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as revenue, COUNT(*) as orders
      FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY month
    `);

    const [top_products] = await pool.query(`
      SELECT p.name, p.thumbnail, SUM(oi.quantity) as sold, SUM(oi.total) as revenue
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      GROUP BY p.id ORDER BY sold DESC LIMIT 5
    `);

    res.json({
      success: true,
      stats: { total_orders, total_revenue, total_users, total_products, pending_orders, low_stock },
      recent_orders, monthly_revenue, top_products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, is_verified, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );
    res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ success: true, message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPendingReviews = async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name, p.name as product_name
      FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id
      WHERE r.is_approved = 0 ORDER BY r.created_at DESC
    `);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
