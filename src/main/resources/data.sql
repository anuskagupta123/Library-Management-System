-- Test data for Library Management System

-- Insert test users
INSERT INTO users (username, password, role, enabled) VALUES 
('admin', '$2a$10$w4u1H9L5Uk3sGkhjMkk4/u0zKiMdl7kBY2wHQNZMc9qU2C5Yvo5k2', 'ADMIN', true),
('john_user', '$2a$10$w4u1H9L5Uk3sGkhjMkk4/u0zKiMdl7kBY2wHQNZMc9qU2C5Yvo5k2', 'USER', true),
('jane_user', '$2a$10$w4u1H9L5Uk3sGkhjMkk4/u0zKiMdl7kBY2wHQNZMc9qU2C5Yvo5k2', 'USER', true),
('alice_user', '$2a$10$w4u1H9L5Uk3sGkhjMkk4/u0zKiMdl7kBY2wHQNZMc9qU2C5Yvo5k2', 'USER', true);

-- Insert test books with categories and cover images
INSERT INTO book (title, author, isbn, category, image_url, available, issued_to, due_date, fine_amount) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', true, null, null, 0.0),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg', true, null, null, 0.0),
('1984', 'George Orwell', '9780451524935', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg', false, 'john_user', CURRENT_TIMESTAMP + INTERVAL '2 days', 0.0),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780316769174-M.jpg', true, null, null, 0.0),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg', false, 'jane_user', CURRENT_TIMESTAMP - INTERVAL '3 days', 3.0),
('Moby-Dick', 'Herman Melville', '9780142437247', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780142437247-M.jpg', true, null, null, 0.0),
('The Lord of the Rings', 'J.R.R. Tolkien', '9780544003415', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780544003415-M.jpg', false, 'alice_user', CURRENT_TIMESTAMP + INTERVAL '1 days', 0.0),
('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', '9780439708180', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780439708180-M.jpg', true, null, null, 0.0),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg', true, null, null, 0.0),
('Dune', 'Frank Herbert', '9780441013593', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9780441013593-M.jpg', true, null, null, 0.0),
('Brave New World', 'Aldous Huxley', '9780060085671', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9780060085671-M.jpg', true, null, null, 0.0),
('Fahrenheit 451', 'Ray Bradbury', '9781451673263', 'Science Fiction', 'https://covers.openlibrary.org/b/isbn/9781451673263-M.jpg', true, null, null, 0.0),
('The Odyssey', 'Homer', '9780140268867', 'History', 'https://covers.openlibrary.org/b/isbn/9780140268867-M.jpg', true, null, null, 0.0),
('The Iliad', 'Homer', '9780140275847', 'History', 'https://covers.openlibrary.org/b/isbn/9780140275847-M.jpg', true, null, null, 0.0),
('Crime and Punishment', 'Fyodor Dostoevsky', '9780143039990', 'Fiction', 'https://covers.openlibrary.org/b/isbn/9780143039990-M.jpg', false, 'john_user', CURRENT_TIMESTAMP - INTERVAL '10 days', 10.0);

-- Note: Password for all test users is "password" (hashed using BCrypt)
-- Usernames: admin, john_user, jane_user, alice_user
