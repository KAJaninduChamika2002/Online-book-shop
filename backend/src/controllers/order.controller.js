const { pool } = require('../config/db');
const { generateOrderNumber } = require('../utils/jwt.utils');

exports.createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const {
      items, coupon_code, shipping_name, shipping_email, shipping_phone,
      shipping_address, shipping_city, shipping_state, shipping_zip,
      payment_method, notes,
    } = req.body;

    // Validate stock and calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const [[product]] = await conn.query('SELECT price, sale_price, stock FROM products WHERE id = ? AND is_active = 1', [item.product_id]);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ${item.product_id}`);
      item.unit_price = product.sale_price || product.price;
      subtotal += item.unit_price * item.quantity;
    }

    // Apply coupon
    let discount = 0;
    let couponId = null;
    if (coupon_code) {
      const [[coupon]] = await conn.query(
        'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expiry IS NULL OR expiry >= CURDATE()) AND (usage_limit IS NULL OR used_count < usage_limit)',
        [coupon_code]
      );
      if (coupon && subtotal >= coupon.min_order) {
        discount = coupon.type === 'percentage' ? (subtotal * coupon.discount / 100) : coupon.discount;
        if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
        couponId = coupon.id;
        await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
      }
    }

    const shipping = subtotal >= 3000 ? 0 : 300;
    const total = subtotal - discount + shipping;
    const orderNumber = generateOrderNumber();

    const [orderResult] = await conn.query(`
      INSERT INTO orders (order_number, user_id, subtotal, discount, shipping, total, coupon_id,
        shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city,
        shipping_state, shipping_zip, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [orderNumber, req.user?.id || null, subtotal, discount, shipping, total, couponId,
       shipping_name, shipping_email, shipping_phone, shipping_address,
       shipping_city, shipping_state, shipping_zip, payment_method, notes]);

    const orderId = orderResult.insertId;

    // Insert items and deduct stock
    for (const item of items) {
      const [[product]] = await conn.query('SELECT name, thumbnail FROM products WHERE id = ?', [item.product_id]);
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, product.name, product.thumbnail, item.quantity, item.unit_price, item.unit_price * item.quantity]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await conn.commit();
    res.status(201).json({ success: true, orderId, orderNumber, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, GROUP_CONCAT(oi.product_name SEPARATOR ', ') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const [[order]] = await pool.query('SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = "admin")',
      [req.params.id, req.user.id, req.user.role]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let where = [];
    const params = [];
    if (status) { where.push('o.status = ?'); params.push(status); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM orders o ${whereClause}`, params);
    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o LEFT JOIN users u ON o.user_id = u.id
      ${whereClause} ORDER BY o.created_at DESC LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    res.json({ success: true, orders, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    await pool.query('UPDATE orders SET status = ?, payment_status = COALESCE(?, payment_status) WHERE id = ?',
      [status, payment_status || null, req.params.id]);
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
