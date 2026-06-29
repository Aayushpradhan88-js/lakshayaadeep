-- Sample data for Lakshyadeep database
-- Run this after creating the schema

--------------------------------------------------
-- SAMPLE POSTS (Blogs + News)
--------------------------------------------------
INSERT INTO posts (title, content, type, image_url, published) VALUES
('Welcome to Lakshyadeep', 'We are excited to launch our new agricultural initiative that will help farmers across the region adopt sustainable farming practices.', 'blog', 'https://images.unsplash.com/photo-1590674206580-a290d6698722?w=800', true),
('New Harvest Season Begins', 'The harvest season has officially begun with record yields expected from our partner farms.', 'news', 'https://images.unsplash.com/photo-1574321604657-3d6093fd3c57?w=800', true),
('Sustainable Farming Workshop', 'Join us for an upcoming workshop on sustainable farming techniques and modern agricultural practices.', 'blog', 'https://images.unsplash.com/photo-1605000797499-95a51c5269a9?w=800', true);

--------------------------------------------------
-- SAMPLE GALLERY IMAGES
--------------------------------------------------
INSERT INTO gallery (image_url, caption) VALUES
('https://images.unsplash.com/photo-1590674206580-a290d6698722?w=800', 'Beautiful green fields at sunrise'),
('https://images.unsplash.com/photo-1574321604657-3d6093fd3c57?w=800', 'Fresh harvest ready for market'),
('https://images.unsplash.com/photo-1605000797499-95a51c5269a9?w=800', 'Modern farming equipment in action'),
('https://images.unsplash.com/photo-1515658402022-3067fcbb3515?w=800', 'Community farming initiative'),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 'Organic vegetable garden');

--------------------------------------------------
-- SAMPLE EVENTS
--------------------------------------------------
INSERT INTO events (title, description, type, location, event_date, image_url) VALUES
('Agricultural Technology Summit', 'A comprehensive summit on the latest in agricultural technology and innovation.', 'virtual', 'Online', '2024-04-15 10:00:00+00', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800'),
('Community Farming Workshop', 'Hands-on workshop for local farmers to learn sustainable techniques.', 'physical', 'Lakshyadeep Community Center', '2024-04-20 09:00:00+00', 'https://images.unsplash.com/photo-1605000797499-95a51c5269a9?w=800'),
('Harvest Festival 2024', 'Annual celebration of the harvest season with farmers and community members.', 'physical', 'Main Farm Location', '2024-05-01 16:00:00+00', 'https://images.unsplash.com/photo-1574321604657-3d6093fd3c57?w=800');

--------------------------------------------------
-- SAMPLE TEAM MEMBERS
--------------------------------------------------
INSERT INTO team_members (name, role, image_url, bio, is_active, display_order) VALUES
('Dr. Rajesh Kumar', 'Agricultural Director', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Dr. Kumar has over 20 years of experience in sustainable agriculture and has been leading our initiatives since 2020.', true, 10),
('Priya Sharma', 'Community Outreach Manager', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', 'Priya works closely with local communities to implement sustainable farming practices and organize educational workshops.', true, 20),
('Amit Patel', 'Technology Coordinator', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'Amit specializes in agricultural technology and helps farmers adopt modern tools and techniques for better yields.', false, 30);

--------------------------------------------------
-- SAMPLE PAGES
--------------------------------------------------
INSERT INTO pages (slug, title, content) VALUES
('about', 'About Lakshyadeep', 'Lakshyadeep is a comprehensive agricultural initiative dedicated to promoting sustainable farming practices, supporting local farmers, and ensuring food security for our communities. Our mission is to bridge traditional farming knowledge with modern agricultural technology.'),
('vision', 'Our Vision', 'Our vision is to create a sustainable agricultural ecosystem where farmers thrive, communities prosper, and the environment is protected. We aim to be the leading platform for agricultural innovation and community development.'),
('terms', 'Terms of Service', 'By using our services, you agree to our terms of service. We are committed to protecting your privacy and ensuring transparent operations. Please read our terms carefully before using our platform.');

--------------------------------------------------
-- SAMPLE DONATIONS
--------------------------------------------------
INSERT INTO donations (name, email, amount, message) VALUES
('Anonymous Supporter', 'supporter@example.com', 500.00, 'Keep up the great work! Happy to support your mission.'),
('Local Business', 'business@example.com', 1000.00, 'We believe in supporting local agricultural initiatives.'),
('Community Member', 'member@example.com', 250.00, 'Thank you for everything you do for our community.');

--------------------------------------------------
-- SAMPLE CONTACTS
--------------------------------------------------
INSERT INTO contacts (name, email, message) VALUES
('John Farmer', 'john@farm.com', 'I am interested in joining your sustainable farming event. Please send me more information.'),
('Sarah Green', 'sarah@example.com', 'I would like to volunteer for the upcoming workshop. How can I help?'),
('Mike Agriculture', 'mike@agri.com', 'We would like to partner with you for equipment supply. Please contact me to discuss opportunities.');
