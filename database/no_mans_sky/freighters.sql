INSERT OR IGNORE INTO freighters (
  freighter_id,
  system_id,
  name,
  freighter_type,
  freighter_class,
  inventory_slots,
  supercharged_slots,
  glyph_address,
  discovered_by,
  notes
) VALUES
  (1, 1, 'Example Capital Freighter', 'Capital', 'S', NULL, NULL, NULL, NULL, 'Template freighter discovery.');
