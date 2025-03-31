USE toyshop_db;

-- Admin user (password: Admin@123)
INSERT INTO users (name, email, password, phone, role, is_verified) VALUES
('Admin User', 'admin@toyshop.lk', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+94771234567', 'admin', TRUE),
('John Perera', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+94779876543', 'user', TRUE);

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Toys', 'toys', 'Educational and fun toys for all ages', 1),
('School Bags', 'school-bags', 'Durable and stylish bags for school', 2),
('Stationery', 'stationery', 'Pens, pencils, rulers and more', 3),
('Books', 'books', 'Story books, textbooks and activity books', 4),
('Art Supplies', 'art-supplies', 'Color pencils, paints, craft kits', 5),
('Water Bottles', 'water-bottles', 'Kids water bottles and lunch boxes', 6),
('Educational Games', 'educational-games', 'Board games and puzzles', 7),
('Accessories', 'accessories', 'Kids accessories and gift items', 8);

-- Brands
INSERT INTO brands (name, slug) VALUES
('LeapFrog', 'leapfrog'),
('LEGO', 'lego'),
('Barbie', 'barbie'),
('Camlin', 'camlin'),
('Classmate', 'classmate'),
('Milton', 'milton'),
('Funskool', 'funskool'),
('Local Brand', 'local-brand');

-- Products
INSERT INTO products (name, slug, description, short_description, price, sale_price, stock, sku, category_id, brand_id, age_group, thumbnail, is_featured, is_bestseller, is_new_arrival) VALUES
-- Toys
('Remote Control Toy Car', 'remote-control-toy-car', 'High-speed remote control car with rechargeable battery. Perfect for kids who love racing. Features LED headlights and 360-degree rotation.', 'High-speed RC car with LED lights', 2500.00, 2000.00, 50, 'TOY-001', 1, 7, '5+', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', TRUE, TRUE, TRUE),
('Barbie Doll Deluxe Set', 'barbie-doll-deluxe-set', 'Complete Barbie doll set with extra outfits, accessories, and a mini house. Encourages imaginative play and creativity in young girls.', 'Complete Barbie set with accessories', 4500.00, NULL, 30, 'TOY-002', 1, 3, '3+', 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400', TRUE, TRUE, FALSE),
('LEGO Classic Building Set (500 pcs)', 'lego-classic-building-set', 'Classic LEGO building set with 500 colorful bricks. Build anything you can imagine! Develops creativity, fine motor skills and problem-solving.', '500-piece classic LEGO set', 6500.00, 5800.00, 25, 'TOY-003', 1, 2, '6+', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', TRUE, FALSE, TRUE),
('Wooden Puzzle Set', 'wooden-puzzle-set', 'Educational wooden puzzle set with animals, numbers and shapes. Made from safe, non-toxic materials. Perfect for early childhood development.', 'Educational wooden puzzle for toddlers', 1800.00, NULL, 40, 'TOY-004', 1, 8, '2+', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400', FALSE, FALSE, TRUE),
('Action Figure Set (5 pcs)', 'action-figure-set', 'Set of 5 superhero action figures. Each figure is 6 inches tall with movable joints. Great for imaginative play and storytelling.', '5-piece superhero action figures', 3200.00, 2800.00, 35, 'TOY-005', 1, 7, '4+', 'https://images.unsplash.com/photo-1608278047522-58806a6ac85b?w=400', FALSE, TRUE, FALSE),

-- School Bags
('Kids School Backpack - Blue', 'kids-school-backpack-blue', 'Spacious and durable school backpack with ergonomic shoulder straps. Multiple compartments for books, water bottle and accessories. Water-resistant material.', 'Ergonomic school backpack', 3500.00, NULL, 60, 'BAG-001', 2, 8, 'All Ages', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', TRUE, TRUE, FALSE),
('Trolley School Bag', 'trolley-school-bag', 'Rolling trolley bag perfect for heavy school loads. Telescopic handle, smooth wheels and spacious compartments. Reduces back strain for kids.', 'Rolling trolley school bag', 5500.00, 4800.00, 20, 'BAG-002', 2, 8, 'All Ages', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', FALSE, FALSE, TRUE),

-- Stationery
('Color Pencil Set (24 pcs)', 'color-pencil-set-24', 'Premium quality color pencils with vibrant, long-lasting colors. Smooth application, break-resistant leads. Perfect for school projects and art.', '24-piece premium color pencils', 800.00, NULL, 150, 'STA-001', 5, 4, 'All Ages', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400', FALSE, TRUE, FALSE),
('Geometry Box Set', 'geometry-box-set', 'Complete geometry box with compass, protractor, set squares, ruler, and pencil. Precision instruments for math and technical drawing.', 'Complete geometry instruments set', 950.00, 800.00, 100, 'STA-002', 3, 4, '8+', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400', FALSE, FALSE, FALSE),
('Ballpoint Pen Set (10 pcs)', 'ballpoint-pen-set', 'Smooth-writing ballpoint pens in assorted colors. Comfortable grip, leak-proof. Great value pack for students.', '10-piece ballpoint pen set', 350.00, NULL, 200, 'STA-003', 3, 4, 'All Ages', 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', FALSE, TRUE, FALSE),

-- Books
('Kids Story Book Collection (5 books)', 'kids-story-book-collection', 'Set of 5 colorfully illustrated story books for young readers. Age-appropriate language and engaging stories to develop reading habits.', 'Set of 5 illustrated story books', 1500.00, 1200.00, 45, 'BOK-001', 4, 8, '4+', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', TRUE, FALSE, TRUE),
('Activity & Coloring Book', 'activity-coloring-book', 'Fun activity book with coloring pages, mazes, dot-to-dot, and word puzzles. Hours of creative entertainment for kids.', 'Activity and coloring book', 450.00, NULL, 80, 'BOK-002', 4, 8, '3+', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', FALSE, FALSE, FALSE),

-- Art Supplies
('Watercolor Paint Set (18 colors)', 'watercolor-paint-set', '18-color watercolor paint set with brush. Non-toxic, vivid colors. Perfect for school projects, art class and creative activities.', '18-color watercolor set with brush', 1200.00, NULL, 70, 'ART-001', 5, 4, 'All Ages', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', FALSE, TRUE, FALSE),
('Kids Craft Kit', 'kids-craft-kit', 'All-in-one craft kit with foam sheets, glitter, stickers, scissors, glue and more. Everything needed for creative projects.', 'Complete kids craft kit', 2200.00, 1900.00, 30, 'ART-002', 5, 8, '5+', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', FALSE, FALSE, TRUE),

-- Water Bottles
('Kids Insulated Water Bottle 500ml', 'kids-insulated-water-bottle', 'Stainless steel insulated water bottle that keeps drinks cold for 12 hours. Leak-proof, BPA-free. Fun animal designs for kids.', 'Insulated stainless steel water bottle', 1200.00, NULL, 90, 'BOT-001', 6, 6, 'All Ages', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', FALSE, TRUE, FALSE),
('Character Lunch Box & Bottle Set', 'character-lunch-box-bottle-set', 'Matching lunch box and water bottle set with popular cartoon characters. Microwave-safe, BPA-free. Perfect for school.', 'Lunch box and bottle combo set', 1800.00, 1500.00, 55, 'BOT-002', 6, 6, 'All Ages', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', TRUE, TRUE, TRUE),

-- Educational Games
('Junior Scrabble Board Game', 'junior-scrabble-board-game', 'Junior version of the classic word game. Builds vocabulary, spelling and strategic thinking. Perfect family game night activity.', 'Classic word building board game', 2800.00, NULL, 25, 'GAM-001', 7, 7, '5+', 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400', FALSE, FALSE, FALSE),
('Math Learning Game Set', 'math-learning-game-set', 'Interactive math game set that makes learning numbers fun. Includes flash cards, dice games and activity sheets for ages 5-10.', 'Fun math learning game set', 1600.00, 1400.00, 40, 'GAM-002', 7, 1, '5+', 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400', FALSE, FALSE, TRUE);

-- Exercise Books
INSERT INTO products (name, slug, description, short_description, price, sale_price, stock, sku, category_id, brand_id, age_group, thumbnail, is_featured, is_bestseller, is_new_arrival) VALUES
('Exercise Book A4 (100 pages)', 'exercise-book-a4', 'High quality A4 exercise book with ruled pages. 100 pages, hard cover. Perfect for school notes and assignments.', 'A4 ruled exercise book 100 pages', 300.00, NULL, 500, 'STA-010', 3, 5, 'All Ages', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400', FALSE, TRUE, FALSE),
('Exercise Book A5 Pack (6 books)', 'exercise-book-a5-pack', 'Pack of 6 A5 exercise books with different rulings (ruled, squared, blank). Ideal for different subjects.', 'Pack of 6 A5 exercise books', 480.00, 420.00, 300, 'STA-011', 3, 5, 'All Ages', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', FALSE, FALSE, FALSE);

-- Coupons
INSERT INTO coupons (code, type, discount, min_order, max_discount, usage_limit, expiry) VALUES
('WELCOME10', 'percentage', 10.00, 500.00, 500.00, 100, '2026-12-31'),
('SCHOOL20', 'percentage', 20.00, 2000.00, 1000.00, 50, '2026-06-30'),
('FLAT500', 'fixed', 500.00, 3000.00, NULL, 30, '2026-03-31'),
('TOYS15', 'percentage', 15.00, 1000.00, 750.00, 75, '2026-12-31');

-- Banners
INSERT INTO banners (title, subtitle, image, link, button_text, position, sort_order) VALUES
('Back to School Sale!', 'Up to 30% off on school bags, books & stationery', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200', '/shop?category=school-bags', 'Shop Now', 'hero', 1),
('New Toy Collection', 'Discover amazing toys for every age', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200', '/shop?category=toys', 'Explore Toys', 'hero', 2),
('Art & Craft Kits', 'Unleash your child''s creativity', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200', '/shop?category=art-supplies', 'Shop Craft', 'hero', 3);

-- Reviews
INSERT INTO reviews (user_id, product_id, rating, title, comment, is_approved) VALUES
(2, 1, 5, 'Amazing car!', 'My son absolutely loves this car. The battery lasts long and the speed is impressive for the price.', TRUE),
(2, 6, 4, 'Great quality bag', 'Very sturdy and spacious. My daughter can fit all her books easily. Highly recommended.', TRUE),
(2, 15, 5, 'Perfect water bottle', 'Keeps water cold all day. No leaks at all. The design is cute too!', TRUE);
