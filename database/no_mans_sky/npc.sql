INSERT OR IGNORE INTO species (species_id, name, category, description) VALUES
  (1, 'Gek', 'NPC Race', 'Trade-oriented species encountered across civilized systems.'),
  (2, 'Korvax', 'NPC Race', 'Synthetic collective species associated with knowledge and research.'),
  (3, 'Vy''keen', 'NPC Race', 'Warrior species associated with combat and honor.'),
  (4, 'Traveller', 'Anomaly', 'Traveller entities encountered through the Atlas and anomaly systems.'),
  (5, 'Autophage', 'NPC Race', 'Robotic civilization introduced through later game content.'),
  (6, 'Sentinel', 'Machine', 'Hostile or neutral planetary machine enforcement network.'),
  (7, 'Pirate', 'Faction', 'Outlaw ships, stations, and raiding groups.');

INSERT OR IGNORE INTO factions (faction_id, name, species_id, description) VALUES
  (1, 'Gek Trade Federation', 1, 'Commerce and trade-aligned Gek faction.'),
  (2, 'Korvax Convergence', 2, 'Collective Korvax knowledge network.'),
  (3, 'Vy''keen High Command', 3, 'Militarized Vy''keen power structure.'),
  (4, 'Mercenaries Guild', NULL, 'Guild missions focused on combat.'),
  (5, 'Explorers Guild', NULL, 'Guild missions focused on exploration and discovery.'),
  (6, 'Merchants Guild', NULL, 'Guild missions focused on trade and deliveries.'),
  (7, 'Outlaws', 7, 'Pirate and black-market networks.');
