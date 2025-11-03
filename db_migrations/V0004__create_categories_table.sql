CREATE TABLE IF NOT EXISTS t_p88186320_torrent_game_platfor.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p88186320_torrent_game_platfor.categories (name, slug) VALUES
('Экшен', 'action'),
('RPG', 'rpg'),
('Хоррор', 'horror'),
('Спорт', 'sport'),
('Гонки', 'racing'),
('Стратегия', 'strategy'),
('Мультиплеер', 'multiplayer'),
('Инди', 'indie');
