CREATE TABLE torrents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    size DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_torrents_category ON torrents(category);
CREATE INDEX idx_torrents_downloads ON torrents(downloads DESC);
