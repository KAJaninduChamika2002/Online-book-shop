const mysql = require('mysql2/promise');

// Pool used for all app queries (with database selected)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'toyshop_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  multipleStatements: true,
});

const connectDB = async () => {
  const dbName = process.env.DB_NAME || 'toyshop_db';

  // Step 1: Connect without a database to create it if missing
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });
  } catch (err) {
    console.error('❌ Cannot connect to MySQL:', err.message);
    console.error('Make sure MySQL / XAMPP is running.');
    process.exit(1);
  }

  try {
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await rootConn.query(`USE \`${dbName}\``);

    // Create all tables (idempotent — safe to run every startup)
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user','admin') DEFAULT 'user',
        avatar VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        otp VARCHAR(10),
        otp_expires DATETIME,
        reset_token VARCHAR(255),
        reset_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        image VARCHAR(255),
        description TEXT,
        parent_id INT DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        logo VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2) DEFAULT NULL,
        stock INT DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        category_id INT,
        brand_id INT,
        age_group VARCHAR(50),
        images JSON,
        thumbnail VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        is_bestseller BOOLEAN DEFAULT FALSE,
        is_new_arrival BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        weight DECIMAL(5,2),
        dimensions VARCHAR(100),
        tags JSON,
        meta_title VARCHAR(200),
        meta_description VARCHAR(300),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        type ENUM('percentage','fixed') DEFAULT 'percentage',
        discount DECIMAL(10,2) NOT NULL,
        min_order DECIMAL(10,2) DEFAULT 0,
        max_discount DECIMAL(10,2) DEFAULT NULL,
        usage_limit INT DEFAULT NULL,
        used_count INT DEFAULT 0,
        expiry DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT,
        subtotal DECIMAL(10,2) NOT NULL,
        discount DECIMAL(10,2) DEFAULT 0,
        shipping DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        coupon_id INT DEFAULT NULL,
        status ENUM('pending','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
        payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        shipping_name VARCHAR(100) NOT NULL,
        shipping_email VARCHAR(150),
        shipping_phone VARCHAR(20),
        shipping_address TEXT NOT NULL,
        shipping_city VARCHAR(100),
        shipping_state VARCHAR(100),
        shipping_zip VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(200) NOT NULL,
        product_image VARCHAR(255),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating TINYINT NOT NULL,
        title VARCHAR(200),
        comment TEXT,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_review (user_id, product_id)
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wishlist (user_id, product_id)
      );

      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200),
        subtitle VARCHAR(300),
        image VARCHAR(255) NOT NULL,
        link VARCHAR(255),
        button_text VARCHAR(50),
        position ENUM('hero','promo','category') DEFAULT 'hero',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS newsletter (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(`✅ Database "${dbName}" ready`);
    await seedIfEmpty(rootConn);
  } catch (err) {
    console.error('❌ Database setup error:', err.message);
    process.exit(1);
  } finally {
    await rootConn.end();
  }

  // Step 2: Verify the pool works
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL pool connected to ${conn.config.host}`);
    conn.release();
  } catch (err) {
    console.error('❌ Pool connection error:', err.message);
    process.exit(1);
  }
};

const seedIfEmpty = async (conn) => {
  const dbName = process.env.DB_NAME || 'toyshop_db';
  await conn.query(`USE \`${dbName}\``);

  const [[{ cnt }]] = await conn.query('SELECT COUNT(*) as cnt FROM users');
  if (cnt > 0) return; // already seeded

  console.log('🌱 Seeding database with sample data...');

  // Admin user (password: password)
  await conn.query(`
    INSERT IGNORE INTO users (name, email, password, phone, role, is_verified) VALUES
    ('Admin User', 'admin@toyshop.lk', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+94771234567', 'admin', 1),
    ('John Perera', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+94779876543', 'user', 1)
  `);

  await conn.query(`
    INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES
    ('Toys', 'toys', 'Educational and fun toys for all ages', 1),
    ('School Bags', 'school-bags', 'Durable and stylish bags for school', 2),
    ('Stationery', 'stationery', 'Pens, pencils, rulers and more', 3),
    ('Books', 'books', 'Story books, textbooks and activity books', 4),
    ('Art Supplies', 'art-supplies', 'Color pencils, paints, craft kits', 5),
    ('Water Bottles', 'water-bottles', 'Kids water bottles and lunch boxes', 6),
    ('Educational Games', 'educational-games', 'Board games and puzzles', 7),
    ('Accessories', 'accessories', 'Kids accessories and gift items', 8)
  `);

  await conn.query(`
    INSERT IGNORE INTO brands (name, slug) VALUES
    ('LeapFrog', 'leapfrog'), ('LEGO', 'lego'), ('Barbie', 'barbie'),
    ('Camlin', 'camlin'), ('Classmate', 'classmate'), ('Milton', 'milton'),
    ('Funskool', 'funskool'), ('Local Brand', 'local-brand')
  `);

  await conn.query(`
    INSERT IGNORE INTO products
      (name,slug,description,short_description,price,sale_price,stock,sku,category_id,brand_id,age_group,thumbnail,is_featured,is_bestseller,is_new_arrival)
    VALUES
    ('Remote Control Toy Car','remote-control-toy-car','High-speed remote control car with rechargeable battery and LED headlights.','High-speed RC car with LED lights',2500.00,2000.00,50,'TOY-001',1,7,'5+','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',1,1,1),
    ('Barbie Doll Deluxe Set','barbie-doll-deluxe-set','Complete Barbie doll set with extra outfits and accessories.','Complete Barbie set with accessories',4500.00,NULL,30,'TOY-002',1,3,'3+','https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400',1,1,0),
    ('LEGO Classic Building Set 500pcs','lego-classic-building-set','Classic LEGO building set with 500 colorful bricks.','500-piece classic LEGO set',6500.00,5800.00,25,'TOY-003',1,2,'6+','https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',1,0,1),
    ('Wooden Puzzle Set','wooden-puzzle-set','Educational wooden puzzle set with animals, numbers and shapes.','Educational wooden puzzle for toddlers',1800.00,NULL,40,'TOY-004',1,8,'2+','https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',0,0,1),
    ('Action Figure Set 5pcs','action-figure-set','Set of 5 superhero action figures with movable joints.','5-piece superhero action figures',3200.00,2800.00,35,'TOY-005',1,7,'4+','https://images.unsplash.com/photo-1608278047522-58806a6ac85b?w=400',0,1,0),
    ('Kids School Backpack Blue','kids-school-backpack-blue','Spacious ergonomic school backpack with multiple compartments.','Ergonomic school backpack',3500.00,NULL,60,'BAG-001',2,8,'All Ages','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',1,1,0),
    ('Trolley School Bag','trolley-school-bag','Rolling trolley bag with telescopic handle and smooth wheels.','Rolling trolley school bag',5500.00,4800.00,20,'BAG-002',2,8,'All Ages','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',0,0,1),
    ('Color Pencil Set 24pcs','color-pencil-set-24','Premium quality color pencils with vibrant long-lasting colors.','24-piece premium color pencils',800.00,NULL,150,'STA-001',5,4,'All Ages','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',0,1,0),
    ('Geometry Box Set','geometry-box-set','Complete geometry box with compass, protractor, set squares and ruler.','Complete geometry instruments set',950.00,800.00,100,'STA-002',3,4,'8+','https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400',0,0,0),
    ('Ballpoint Pen Set 10pcs','ballpoint-pen-set','Smooth-writing ballpoint pens in assorted colors.','10-piece ballpoint pen set',350.00,NULL,200,'STA-003',3,4,'All Ages','https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',0,1,0),
    ('Kids Story Book Collection','kids-story-book-collection','Set of 5 colorfully illustrated story books for young readers.','Set of 5 illustrated story books',1500.00,1200.00,45,'BOK-001',4,8,'4+','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',1,0,1),
    ('Activity Coloring Book','activity-coloring-book','Fun activity book with coloring pages, mazes and word puzzles.','Activity and coloring book',450.00,NULL,80,'BOK-002',4,8,'3+','https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',0,0,0),
    ('Watercolor Paint Set 18 colors','watercolor-paint-set','18-color watercolor paint set with brush. Non-toxic vivid colors.','18-color watercolor set with brush',1200.00,NULL,70,'ART-001',5,4,'All Ages','https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',0,1,0),
    ('Kids Craft Kit','kids-craft-kit','All-in-one craft kit with foam sheets, glitter, stickers and more.','Complete kids craft kit',2200.00,1900.00,30,'ART-002',5,8,'5+','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',0,0,1),
    ('Kids Insulated Water Bottle 500ml','kids-insulated-water-bottle','Stainless steel insulated water bottle. Keeps drinks cold 12 hours.','Insulated stainless steel water bottle',1200.00,NULL,90,'BOT-001',6,6,'All Ages','https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',0,1,0),
    ('Character Lunch Box Bottle Set','character-lunch-box-bottle-set','Matching lunch box and water bottle set with cartoon characters.','Lunch box and bottle combo set',1800.00,1500.00,55,'BOT-002',6,6,'All Ages','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',1,1,1),
    ('Junior Scrabble Board Game','junior-scrabble-board-game','Junior word game that builds vocabulary and strategic thinking.','Classic word building board game',2800.00,NULL,25,'GAM-001',7,7,'5+','https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400',0,0,0),
    ('Math Learning Game Set','math-learning-game-set','Interactive math game set that makes learning numbers fun.','Fun math learning game set',1600.00,1400.00,40,'GAM-002',7,1,'5+','https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400',0,0,1),
    ('Exercise Book A4 100 pages','exercise-book-a4','High quality A4 exercise book with ruled pages. 100 pages hard cover.','A4 ruled exercise book 100 pages',300.00,NULL,500,'STA-010',3,5,'All Ages','https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',0,1,0),
    ('Exercise Book A5 Pack 6 books','exercise-book-a5-pack','Pack of 6 A5 exercise books with different rulings.','Pack of 6 A5 exercise books',480.00,420.00,300,'STA-011',3,5,'All Ages','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',0,0,0)
  `);

  await conn.query(`
    INSERT IGNORE INTO coupons (code,type,discount,min_order,max_discount,usage_limit,expiry) VALUES
    ('WELCOME10','percentage',10.00,500.00,500.00,100,'2027-12-31'),
    ('SCHOOL20','percentage',20.00,2000.00,1000.00,50,'2027-06-30'),
    ('FLAT500','fixed',500.00,3000.00,NULL,30,'2027-03-31'),
    ('TOYS15','percentage',15.00,1000.00,750.00,75,'2027-12-31')
  `);

  await conn.query(`
    INSERT IGNORE INTO banners (title,subtitle,image,link,button_text,position,sort_order) VALUES
    ('Back to School Sale!','Up to 30% off on school bags, books & stationery','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200','/shop?category=school-bags','Shop Now','hero',1),
    ('New Toy Collection','Discover amazing toys for every age','https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200','/shop?category=toys','Explore Toys','hero',2),
    ('Art & Craft Kits','Unleash your child creativity','https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200','/shop?category=art-supplies','Shop Craft','hero',3)
  `);

  console.log('✅ Sample data seeded successfully');
};

module.exports = { pool, connectDB };
