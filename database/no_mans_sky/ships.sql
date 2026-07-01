INSERT OR IGNORE INTO ship_classes (ship_class_id, name, description) VALUES
  (1, 'C', 'Lowest class tier.'),
  (2, 'B', 'Standard class tier.'),
  (3, 'A', 'High class tier.'),
  (4, 'S', 'Top class tier.');

INSERT OR IGNORE INTO ships (
  ship_id,
  system_id,
  planet_id,
  name,
  ship_class_id,
  archetype,
  inventory_slots,
  supercharged_slots,
  seed,
  glyph_address,
  discovered_by,
  notes
) VALUES
  (1, 1, NULL, 'Example Fighter', 4, 'Fighter', NULL, NULL, NULL, NULL, NULL, 'Template ship discovery.'),
  (2, 1, NULL, 'Example Explorer', 3, 'Explorer', NULL, NULL, NULL, NULL, NULL, 'Template ship discovery.'),
  (3, 1, NULL, 'Example Hauler', 2, 'Hauler', NULL, NULL, NULL, NULL, NULL, 'Template ship discovery.'),
  (4, 1, NULL, 'Example Solar Ship', 3, 'Solar', NULL, NULL, NULL, NULL, NULL, 'Template ship discovery.'),
  (5, 1, NULL, 'Example Sentinel Interceptor', 4, 'Interceptor', NULL, NULL, NULL, NULL, NULL, 'Template ship discovery.');
