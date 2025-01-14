const { pool } = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const {
      category, brand, minPrice, maxPrice, ageGroup,
      sort = 'created_at', order = 'DESC',
      page = 1, limit = 12, search, featured, bestseller, newArrival,
    } = req.query;

    let where = ['p.is_active = 1'];
    const params = [];

    if (category) { where.push('c.slug = ?'); params.push(category); }
    if (brand) { where.push('b.slug = ?'); params.push(brand); }
    if (minPrice) { where.push('p.price >= ?'); params.push(minPrice); }
    if (maxPrice) { where.push('p.price <= ?'); params.push(maxPrice); }
    if (ageGroup) { where.push('p.age_group = ?'); params.push(ageGroup); }
    if (featured === 'true') { where.push('p.is_featured = 1'); }
    if (bestseller === 'true') { where.push('p.is_bestseller = 1'); }
    if (newArrival === 'true') { where.push('p.is_new_arrival = 1'); }
    if (search) { where.push('(p.name LIKE ? OR p.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const sortMap = {
      price_asc: 'p.price ASC', price_desc: 'p.price DESC',
      name: 'p.name ASC', newest: 'p.created_at DESC', popular: 'p.is_bestseller DESC',
    };
    const orderBy = sortMap[sort] || `p.${sort} ${order}`;

    const countQuery = `
      SELECT COUNT(*) as total FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ${whereClause}
    `;
    const dataQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             b.name as brand_name,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      ${whereClause}
      GROUP BY p.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const [[{ total }]] = await pool.query(countQuery, params);
    const [products] = await pool.query(dataQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      products,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name,
             COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.slug = ? AND p.is_active = 1
      GROUP BY p.id
    `, [req.params.slug]);

    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });

    const product = rows[0];
    if (product.images) product.images = JSON.parse(product.images);
    if (product.tags) product.tags = JSON.parse(product.tags);

    // Related products
    const [related] = await pool.query(`
      SELECT p.*, COALESCE(AVG(r.rating), 0) as avg_rating
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      GROUP BY p.id LIMIT 4
    `, [product.category_id, product.id]);

    res.json({ success: true, product, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, short_description, price, sale_price, stock,
      sku, category_id, brand_id, age_group, thumbnail, images, tags,
      is_featured, is_bestseller, is_new_arrival, weight, dimensions,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(`
      INSERT INTO products (name, slug, description, short_description, price, sale_price, stock,
        sku, category_id, brand_id, age_group, thumbnail, images, tags,
        is_featured, is_bestseller, is_new_arrival, weight, dimensions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, slug, description, short_description, price, sale_price || null, stock,
       sku, category_id, brand_id || null, age_group, thumbnail,
       images ? JSON.stringify(images) : null,
       tags ? JSON.stringify(tags) : null,
       is_featured ? 1 : 0, is_bestseller ? 1 : 0, is_new_arrival ? 1 : 0,
       weight || null, dimensions || null]);

    res.status(201).json({ success: true, id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    if (fields.images) fields.images = JSON.stringify(fields.images);
    if (fields.tags) fields.tags = JSON.stringify(fields.tags);
    if (fields.name) fields.slug = fields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE products SET ${sets} WHERE id = ?`, [...Object.values(fields), id]);
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });
    const [rows] = await pool.query(
      'SELECT id, name, slug, thumbnail, price FROM products WHERE name LIKE ? AND is_active = 1 LIMIT 6',
      [`%${q}%`]
    );
    res.json({ success: true, suggestions: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
