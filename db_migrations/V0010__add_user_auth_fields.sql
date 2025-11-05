-- Add email, password_hash, and avatar columns to users table
ALTER TABLE t_p88186320_torrent_game_platfor.users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500),
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);