INSERT OR IGNORE INTO minerals (
  mineral_id,
  planet_id,
  name,
  scan_name,
  primary_element_id,
  secondary_element_id,
  rarity,
  notes
) VALUES
  (1, 1, 'Example Mineral', 'Catalog pending', 3, NULL, 'Unknown', 'Template mineral row for planetary scans.');

INSERT OR IGNORE INTO planet_resources (planet_id, resource_id, abundance) VALUES
  (1, 1, 'Common'),
  (1, 3, 'Common'),
  (1, 6, 'Common'),
  (1, 7, 'Common'),
  (1, 11, 'Unknown');
