-- Add is_admin column to users table
ALTER TABLE t_p88186320_torrent_game_platfor.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;