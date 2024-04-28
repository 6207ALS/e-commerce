INSERT INTO categories (title)
VALUES ('Cosmetics'), ('Clothing'), ('Electronics'), ('Furniture'),
('Gardening'), ('Hardware'), ('Sporting Goods'), ('Toys');

INSERT INTO items (title, price)
VALUES ('Moisturizer', 9.99), ('Perfume', 19.99), ('Lipstick', 10.99),
('Shampoo', 8.99), ('Hair Dye', 10.99), ('Deodorant', 5.99), 
('Toothpaste', 4.99), ('Conditioner', 9.99), ('Nail Polish', 6.99), 
('Baby Oil', 4.99), ('Hair Spray', 5.99), ('Sunscreen', 4.99),
('Acne Cream', 10.99), ('Soap', 2.99), 

('Pants', 40.99), ('T-Shirt', 20.99), ('Socks', 6.99), ('Hat', 13.99), 
('Gloves', 12.99), ('Skirt', 23.99), ('Jacket', 59.99), ('Sweater', 39.99),   
('Scarf', 15.99), ('Shorts', 24.99), ('Coat', 65.99), ('Backpack', 46.99), 
('Pajamas', 24.99), ('Tanktop', 10.99), 

('Laptop', 129.99), ('Phone', 249.99), ('Router', 89.99), ('Television', 100.99),   
('Camera', 350.99), ('Headphone', 124.99), ('Game Controller', 60.99), 
('Printer',189.99), ('Phone Charger', 25.99), ('Video Game', 49.99), 
('Speakers', 89.99), ('Lamp', 30.99), ('Nail Drill', 49.99), ('Toaster', 49.99),   

('Chair', 34.99), ('Table', 95.99), ('Bed Frame', 89.99), ('Clock', 20.99), 
('Desk', 110.99), ('Bookcase', 75.99), ('Coat Rack', 59.99), 
('Office Chair', 89.99), ('Stool', 39.99), ('Bookshelf', 39.99), 
('Closet', 59.99), ('Mirror', 39.99), 

('Shovel', 18.99), ('Rake', 16.99), ('Hoe', 12.99), ('Garden Hose', 10.99),  
('Watering Can', 8.99), ('Wheel Barrow', 49.99), ('Nails', 5.99), 
('Flower Pot', 8.99), ('Shear', 6.99), ('Vegetable Seeds', 4.99), 
('Bird House', 10.99), ('Axe', 24.99),

('Hammer', 10.99), ('Paint', 10.99), ('Wrench', 12.99), ('Extension Cord', 5.99), 
('Garbage Can', 12.99), ('Screwdriver', 8.99), ('Box Cutter', 5.99), 
('Ruler', 4.99), ('Tape', 2.99), ('Glue', 2.99),

('Football', 12.99), ('Basketball', 14.99), ('Soccer Ball', 13.99), 
('Baseball', 12.99), ('Tennis Ball', 8.99), ('Swimming Goggles', 10.99), 
('Jump Rope', 8.99), ('Bicycle', 89.99), ('Bowling Ball', 59.99), 
('Roller Skates', 49.99), ('Skateboard', 49.99), ('Snowboard', 68.99),
('Frisbee', 15.99),

('Doll', 20.99), ('Teddy Bear', 20.99), ('Kite', 8.99), ('Toy Airplane', 14.99), 
('Building Blocks', 125.99), ('Board Game', 39.99), ('Water Gun', 13.99), 
('Action Figure', 19.99);

INSERT INTO categories_items (item_id, category_id) VALUES
(1, 1),  (2, 1),  (3, 1),  (4, 1),  (5, 1),  (6, 1),  (7, 1), 
(8, 1),  (9, 1),  (10, 1), (11, 1), (12, 1), (13, 1), (14, 1), 

(15, 2), (16, 2), (17, 2), (18, 2), (19, 2), (19, 5), (19, 7), (20, 2),  
(21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (26, 2), (27, 2), (28, 2), 

(29, 3), (30, 3), (31, 3), (32, 3), (32, 4), (33, 3), (34, 3), (35, 3), (35, 8), 
(36, 3), (37, 3), (38, 3), (38, 8), (39, 3), (40, 3), (40, 4), (41, 3), (41, 6), 
(41, 5), (42, 3), 

(43, 4), (44, 4), (45, 4), (46, 4), (47, 4), (48, 4), (49, 4), (50, 4), 
(51, 4), (52, 4), (53, 4), (54, 4), 

(55, 5), (55, 6), (56, 5), (57, 5), (58, 5), (59, 5), (60, 5), 
(61, 5), (61, 6), (62, 5), (63, 5), (64, 5), (65, 5), (66, 5), (66, 6),

(67, 6), (68, 6), (69, 6), (70, 6), 
(71, 6), (72, 6), (73, 6), (74, 6), (75, 6), (76, 6), 

(77, 7), (78, 7), (79, 7), (80, 7), (81, 7), (82, 7), (83, 7), (83, 8), (84, 7), 
(85, 7), (86, 7), (87, 7), (87, 8), (88, 7), (88, 8), (89, 7), (89, 8),

(90, 8),
(91, 8), (92, 8), (93, 8), (94, 8), (95, 8), (96, 8), (97, 8);