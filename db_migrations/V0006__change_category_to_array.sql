-- Change category column to array type to support multiple categories
ALTER TABLE t_p88186320_torrent_game_platfor.torrents 
ALTER COLUMN category TYPE text[] USING ARRAY[category];