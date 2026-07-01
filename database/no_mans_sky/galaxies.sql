INSERT OR IGNORE INTO metadata (metadata_key, metadata_value, source_url, notes) VALUES
  ('nms_galaxy_count', '256', 'https://nomanssky.fandom.com/wiki/Galaxy', 'Official galaxy slot count referenced by the community wiki.'),
  ('nms_galaxy_hex_range', '00-FF', 'https://nomanssky.fandom.com/wiki/Galaxy', 'Galaxy IDs are represented as hexadecimal slots 00 through FF.'),
  ('nms_estimated_star_systems', '4300000000000', 'https://nomanssky.fandom.com/wiki/Galaxy', 'Approximate procedural scale; not intended for exhaustive seeding.'),
  ('nms_estimated_accessible_planets', '2000000000000000', 'https://nomanssky.fandom.com/wiki/Galaxy', 'Approximate procedural scale; not intended for exhaustive seeding.');

INSERT OR IGNORE INTO galaxy_types (galaxy_type_id, code, name, description) VALUES
  (1, 'NORMAL', 'Normal', 'Balanced galaxy generation.'),
  (2, 'HARSH', 'Harsh', 'More extreme and hostile planet generation.'),
  (3, 'LUSH', 'Lush', 'Higher chance of lush/paradise-style worlds.'),
  (4, 'EMPTY', 'Empty', 'More dead, abandoned, or sparse worlds.'),
  (5, 'HIDDEN', 'Hidden', 'Special galaxy not normally reached through standard galaxy progression.');

WITH RECURSIVE galaxy_numbers(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM galaxy_numbers WHERE n < 256
)
INSERT OR IGNORE INTO galaxies (number, zero_based_index, hex_id, name, source_url, notes)
SELECT
  n,
  n - 1,
  printf('%02X', n - 1),
  NULL,
  'https://nomanssky.fandom.com/wiki/Galaxy',
  'Official galaxy slot seeded by number and hex ID. Add or verify name from the wiki/community dataset.'
FROM galaxy_numbers;

UPDATE galaxies SET name = 'Euclid', galaxy_type_id = 1 WHERE number = 1;
UPDATE galaxies SET name = 'Hilbert Dimension', galaxy_type_id = 1 WHERE number = 2;
UPDATE galaxies SET name = 'Calypso', galaxy_type_id = 2 WHERE number = 3;
UPDATE galaxies SET name = 'Hesperius Dimension', galaxy_type_id = 1 WHERE number = 4;
UPDATE galaxies SET name = 'Hyades', galaxy_type_id = 1 WHERE number = 5;
UPDATE galaxies SET name = 'Ickjamatew', galaxy_type_id = 1 WHERE number = 6;
UPDATE galaxies SET name = 'Budullangr', galaxy_type_id = 4 WHERE number = 7;
UPDATE galaxies SET name = 'Kikolgallr', galaxy_type_id = 1 WHERE number = 8;
UPDATE galaxies SET name = 'Eltiensleen', galaxy_type_id = 1 WHERE number = 9;
UPDATE galaxies SET name = 'Eissentam', galaxy_type_id = 3 WHERE number = 10;
UPDATE galaxies SET name = 'Elkupalos', galaxy_type_id = 1 WHERE number = 11;
UPDATE galaxies SET name = 'Aptarkaba', galaxy_type_id = 4 WHERE number = 12;
UPDATE galaxies SET name = 'Ontiniangp', galaxy_type_id = 1 WHERE number = 13;
UPDATE galaxies SET name = 'Odiwagiri', galaxy_type_id = 1 WHERE number = 14;
UPDATE galaxies SET name = 'Ogtialabi', galaxy_type_id = 2 WHERE number = 15;
UPDATE galaxies SET name = 'Muhacksonto', galaxy_type_id = 1 WHERE number = 16;
UPDATE galaxies SET name = 'Hitonskyer', galaxy_type_id = 1 WHERE number = 17;
UPDATE galaxies SET name = 'Rerasmutul', galaxy_type_id = 1 WHERE number = 18;
UPDATE galaxies SET name = 'Isdoraijung', galaxy_type_id = 3 WHERE number = 19;
UPDATE galaxies SET name = 'Doctinawyra', galaxy_type_id = 1 WHERE number = 20;
UPDATE galaxies SET name = 'Loychazinq', galaxy_type_id = 1 WHERE number = 21;
UPDATE galaxies SET name = 'Zukasizawa', galaxy_type_id = 1 WHERE number = 22;
UPDATE galaxies SET name = 'Ekwathore', galaxy_type_id = 2 WHERE number = 23;
UPDATE galaxies SET name = 'Yeberhahne', galaxy_type_id = 1 WHERE number = 24;
UPDATE galaxies SET name = 'Twerbetek', galaxy_type_id = 1 WHERE number = 25;
UPDATE galaxies SET name = 'Sivarates', galaxy_type_id = 1 WHERE number = 26;
UPDATE galaxies SET name = 'Eajerandal', galaxy_type_id = 4 WHERE number = 27;
UPDATE galaxies SET name = 'Aldukesci', galaxy_type_id = 1 WHERE number = 28;
UPDATE galaxies SET name = 'Wotyarogii', galaxy_type_id = 1 WHERE number = 29;
UPDATE galaxies SET name = 'Sudzerbal', galaxy_type_id = 3 WHERE number = 30;

UPDATE galaxies SET name = 'Odyalutai', galaxy_type_id = 5, is_hidden = 1, notes = 'Hidden galaxy known through community documentation.' WHERE number = 256;
