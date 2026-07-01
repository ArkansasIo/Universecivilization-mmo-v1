INSERT OR IGNORE INTO star_systems (
  system_id,
  region_id,
  galaxy_id,
  name,
  economy_type_id,
  economy_level,
  conflict_level_id,
  dominant_species_id,
  star_color,
  spectral_class,
  portal_glyph_address,
  galactic_address,
  x,
  y,
  z,
  notes
) VALUES
  (1, 1, 1, 'Example Discovery System', 12, 2, 1, 1, 'Yellow', 'G', NULL, NULL, 0, 0, 0, 'Replace with player-discovered system data.');

INSERT OR IGNORE INTO space_stations (
  station_id,
  system_id,
  name,
  faction_id,
  economy_type_id,
  has_teleporter,
  notes
) VALUES
  (1, 1, 'Example Space Station', 1, 12, 1, 'Template station row for a discovered system.');
