CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    torrent_id INTEGER REFERENCES torrents(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_torrent_id ON comments(torrent_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

INSERT INTO users (username) VALUES
('user1'), ('user2'), ('user3'), ('user4'), ('user5'),
('user6'), ('user7'), ('user8'), ('user9'), ('user10'),
('gamer123'), ('proPlayer'), ('noob2024'), ('admin'), ('moderator'),
('testuser'), ('demo'), ('player99'), ('winner'), ('loser');

INSERT INTO comments (torrent_id, user_id, content) VALUES
(1, 1, 'Отличная игра!'),
(1, 2, 'Графика супер'),
(1, 3, 'Очень понравилось'),
(2, 4, 'Сложная, но интересная'),
(2, 5, 'FromSoftware не подводит'),
(3, 6, 'Лучшая игра!'),
(3, 7, 'Шедевр от Rockstar'),
(4, 8, 'Потрясающий сюжет'),
(5, 9, 'Затягивает надолго'),
(6, 10, 'Простая, но крутая'),
(7, 11, 'Релаксирующая игра'),
(8, 12, 'Динамичный геймплей'),
(9, 13, 'Классика жанра'),
(10, 14, 'Выживание топ'),
(11, 15, 'Играю с друзьями'),
(12, 16, 'Динозавры огонь');
