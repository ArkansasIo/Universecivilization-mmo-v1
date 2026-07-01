INSERT OR IGNORE INTO frigates (
  frigate_id,
  freighter_id,
  system_id,
  name,
  role,
  frigate_class,
  traits,
  discovered_by,
  notes
) VALUES
  (1, 1, 1, 'Example Combat Frigate', 'Combat', 'A', NULL, NULL, 'Template frigate discovery.'),
  (2, 1, 1, 'Example Industrial Frigate', 'Industrial', 'B', NULL, NULL, 'Template frigate discovery.'),
  (3, 1, 1, 'Example Exploration Frigate', 'Exploration', 'A', NULL, NULL, 'Template frigate discovery.'),
  (4, 1, 1, 'Example Trade Frigate', 'Trade', 'B', NULL, NULL, 'Template frigate discovery.'),
  (5, 1, 1, 'Example Support Frigate', 'Support', 'A', NULL, NULL, 'Template frigate discovery.');
