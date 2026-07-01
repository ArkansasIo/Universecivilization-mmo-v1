INSERT OR IGNORE INTO missions (
  mission_id,
  system_id,
  station_id,
  faction_id,
  name,
  mission_type,
  rank_requirement,
  reward,
  notes
) VALUES
  (1, 1, NULL, 5, 'Survey Unknown Worlds', 'Exploration', 'None', 'Units, nanites, standing', 'Template mission row.'),
  (2, 1, NULL, 4, 'Eliminate Hostile Ships', 'Combat', 'None', 'Units, nanites, standing', 'Template mission row.'),
  (3, 1, NULL, 6, 'Deliver Trade Goods', 'Delivery', 'None', 'Units, nanites, standing', 'Template mission row.');
