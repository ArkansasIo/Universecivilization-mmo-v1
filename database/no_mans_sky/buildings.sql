INSERT OR IGNORE INTO building_types (building_type_id, name, category, description) VALUES
  (1, 'Minor Settlement', 'Civilian', 'Small trading outpost with NPC and vendor.'),
  (2, 'Trading Post', 'Trade', 'Planetary landing and trade hub.'),
  (3, 'Observatory', 'Navigation', 'Planetary signal and discovery structure.'),
  (4, 'Transmission Tower', 'Navigation', 'Distress and waypoint signal structure.'),
  (5, 'Manufacturing Facility', 'Industrial', 'Factory-style secured structure.'),
  (6, 'Operations Centre', 'Industrial', 'Secured operations building.'),
  (7, 'Depot', 'Resource', 'Resource storage depot.'),
  (8, 'Ancient Ruin', 'Lore', 'Ancient cultural ruin.'),
  (9, 'Monolith', 'Lore', 'Alien monolith interaction site.'),
  (10, 'Portal', 'Travel', 'Glyph portal structure.'),
  (11, 'Abandoned Building', 'Hazard', 'Derelict surface building.'),
  (12, 'Crashed Ship', 'Salvage', 'Recoverable crashed starship site.'),
  (13, 'Sentinel Pillar', 'Sentinel', 'Sentinel control and lore site.'),
  (14, 'Base Computer', 'Player Base', 'Player base claim location.');

INSERT OR IGNORE INTO buildings (
  building_id,
  planet_id,
  system_id,
  building_type_id,
  name,
  portal_glyph_address,
  latitude,
  longitude,
  discovered_by,
  notes
) VALUES
  (1, 1, 1, 2, 'Example Trading Post', NULL, NULL, NULL, NULL, 'Template building row.');

INSERT OR IGNORE INTO bases (
  base_id,
  planet_id,
  name,
  owner,
  platform,
  mode,
  portal_glyph_address,
  latitude,
  longitude,
  uploaded_at,
  notes
) VALUES
  (1, 1, 'Example Traveller Base', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Template player base row.');

INSERT OR IGNORE INTO discoveries (
  discovery_id,
  galaxy_id,
  region_id,
  system_id,
  planet_id,
  discovery_type,
  name,
  discovered_by,
  discovered_at,
  source_url,
  notes
) VALUES
  (1, 1, 1, 1, 1, 'Planet', 'Example Catalog Planet', NULL, NULL, NULL, 'Template discovery row.');
