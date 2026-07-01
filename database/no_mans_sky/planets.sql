INSERT OR IGNORE INTO biomes (biome_id, name, category, description) VALUES
  (1, 'Lush', 'Biome', 'Temperate worlds with higher chance of flora and paradise conditions.'),
  (2, 'Barren', 'Biome', 'Dry or desert-like worlds.'),
  (3, 'Scorched', 'Biome', 'Hot worlds with heat hazards.'),
  (4, 'Frozen', 'Biome', 'Cold worlds with freezing hazards.'),
  (5, 'Toxic', 'Biome', 'Toxic worlds with poison hazards.'),
  (6, 'Radioactive', 'Biome', 'Radioactive worlds with radiation hazards.'),
  (7, 'Dead', 'Biome', 'Airless or lifeless worlds.'),
  (8, 'Exotic', 'Biome', 'Anomalous worlds with unusual biome presentation.'),
  (9, 'Marsh', 'Biome', 'Wet and swamp-like worlds.'),
  (10, 'Volcanic', 'Biome', 'Volcanic worlds with severe heat and eruptions.'),
  (11, 'Infested', 'Biome', 'Corrupted or biological infestation worlds.'),
  (12, 'Dissonant', 'Planet State', 'World with corrupted sentinel/dissonance traits.');

INSERT OR IGNORE INTO planets (
  planet_id,
  system_id,
  name,
  is_moon,
  biome_id,
  weather,
  sentinel_activity,
  flora_count,
  fauna_count,
  mineral_count,
  resource_richness,
  gravity,
  notes
) VALUES
  (1, 1, 'Example Catalog Planet', 0, 1, 'Temperate', 'Low', NULL, NULL, NULL, 'Unknown', 'Standard', 'Replace with a real scanned planet or moon.');
