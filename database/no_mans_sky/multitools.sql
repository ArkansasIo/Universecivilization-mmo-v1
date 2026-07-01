INSERT OR IGNORE INTO multitool_classes (multitool_class_id, name, description) VALUES
  (1, 'C', 'Lowest class tier.'),
  (2, 'B', 'Standard class tier.'),
  (3, 'A', 'High class tier.'),
  (4, 'S', 'Top class tier.');

INSERT OR IGNORE INTO multitools (
  multitool_id,
  system_id,
  planet_id,
  name,
  multitool_class_id,
  cabinet_location,
  inventory_slots,
  supercharged_slots,
  glyph_address,
  discovered_by,
  notes
) VALUES
  (1, 1, NULL, 'Example Multi-Tool', 3, 'Space station cabinet', NULL, NULL, NULL, NULL, 'Template multi-tool discovery.');
