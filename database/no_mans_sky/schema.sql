PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS metadata (
  metadata_key TEXT PRIMARY KEY,
  metadata_value TEXT NOT NULL,
  source_url TEXT,
  notes TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS galaxy_types (
  galaxy_type_id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS galaxies (
  galaxy_id INTEGER PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 256),
  zero_based_index INTEGER NOT NULL UNIQUE CHECK (zero_based_index BETWEEN 0 AND 255),
  hex_id TEXT NOT NULL UNIQUE,
  name TEXT,
  galaxy_type_id INTEGER REFERENCES galaxy_types(galaxy_type_id),
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  source_url TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS regions (
  region_id INTEGER PRIMARY KEY,
  galaxy_id INTEGER NOT NULL REFERENCES galaxies(galaxy_id) ON DELETE CASCADE,
  name TEXT,
  region_code TEXT,
  x INTEGER,
  y INTEGER,
  z INTEGER,
  discovered_by TEXT,
  discovered_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS economy_types (
  economy_type_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS conflict_levels (
  conflict_level_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  ordinal INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS species (
  species_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS factions (
  faction_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  species_id INTEGER REFERENCES species(species_id),
  description TEXT
);

CREATE TABLE IF NOT EXISTS star_systems (
  system_id INTEGER PRIMARY KEY,
  region_id INTEGER REFERENCES regions(region_id) ON DELETE SET NULL,
  galaxy_id INTEGER NOT NULL REFERENCES galaxies(galaxy_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  economy_type_id INTEGER REFERENCES economy_types(economy_type_id),
  economy_level INTEGER CHECK (economy_level BETWEEN 1 AND 3),
  conflict_level_id INTEGER REFERENCES conflict_levels(conflict_level_id),
  dominant_species_id INTEGER REFERENCES species(species_id),
  star_color TEXT,
  spectral_class TEXT,
  water_level TEXT,
  portal_glyph_address TEXT,
  galactic_address TEXT,
  x REAL,
  y REAL,
  z REAL,
  discovered_by TEXT,
  discovered_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS biomes (
  biome_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS planets (
  planet_id INTEGER PRIMARY KEY,
  system_id INTEGER NOT NULL REFERENCES star_systems(system_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_moon INTEGER NOT NULL DEFAULT 0 CHECK (is_moon IN (0, 1)),
  parent_planet_id INTEGER REFERENCES planets(planet_id) ON DELETE SET NULL,
  biome_id INTEGER REFERENCES biomes(biome_id),
  weather TEXT,
  sentinel_activity TEXT,
  flora_count INTEGER,
  fauna_count INTEGER,
  mineral_count INTEGER,
  resource_richness TEXT,
  gravity TEXT,
  atmosphere TEXT,
  has_rings INTEGER CHECK (has_rings IN (0, 1)),
  portal_glyph_address TEXT,
  galactic_address TEXT,
  x REAL,
  y REAL,
  z REAL,
  discovered_by TEXT,
  discovered_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS resources (
  resource_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  resource_group TEXT,
  rarity TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS planet_resources (
  planet_id INTEGER NOT NULL REFERENCES planets(planet_id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES resources(resource_id) ON DELETE CASCADE,
  abundance TEXT,
  PRIMARY KEY (planet_id, resource_id)
);

CREATE TABLE IF NOT EXISTS flora (
  flora_id INTEGER PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(planet_id) ON DELETE CASCADE,
  name TEXT,
  scan_name TEXT,
  rarity TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS fauna (
  fauna_id INTEGER PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(planet_id) ON DELETE CASCADE,
  name TEXT,
  scan_name TEXT,
  genus TEXT,
  temperament TEXT,
  diet TEXT,
  rarity TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS minerals (
  mineral_id INTEGER PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(planet_id) ON DELETE CASCADE,
  name TEXT,
  scan_name TEXT,
  primary_element_id INTEGER REFERENCES resources(resource_id),
  secondary_element_id INTEGER REFERENCES resources(resource_id),
  rarity TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS building_types (
  building_type_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS buildings (
  building_id INTEGER PRIMARY KEY,
  planet_id INTEGER REFERENCES planets(planet_id) ON DELETE CASCADE,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE CASCADE,
  building_type_id INTEGER NOT NULL REFERENCES building_types(building_type_id),
  name TEXT,
  portal_glyph_address TEXT,
  latitude REAL,
  longitude REAL,
  discovered_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS space_stations (
  station_id INTEGER PRIMARY KEY,
  system_id INTEGER NOT NULL REFERENCES star_systems(system_id) ON DELETE CASCADE,
  name TEXT,
  faction_id INTEGER REFERENCES factions(faction_id),
  economy_type_id INTEGER REFERENCES economy_types(economy_type_id),
  has_teleporter INTEGER CHECK (has_teleporter IN (0, 1)),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS ship_classes (
  ship_class_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS ships (
  ship_id INTEGER PRIMARY KEY,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  planet_id INTEGER REFERENCES planets(planet_id) ON DELETE SET NULL,
  name TEXT,
  ship_class_id INTEGER REFERENCES ship_classes(ship_class_id),
  archetype TEXT,
  inventory_slots INTEGER,
  supercharged_slots INTEGER,
  seed TEXT,
  glyph_address TEXT,
  discovered_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS multitool_classes (
  multitool_class_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS multitools (
  multitool_id INTEGER PRIMARY KEY,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  planet_id INTEGER REFERENCES planets(planet_id) ON DELETE SET NULL,
  name TEXT,
  multitool_class_id INTEGER REFERENCES multitool_classes(multitool_class_id),
  cabinet_location TEXT,
  inventory_slots INTEGER,
  supercharged_slots INTEGER,
  glyph_address TEXT,
  discovered_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS freighters (
  freighter_id INTEGER PRIMARY KEY,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  name TEXT,
  freighter_type TEXT,
  freighter_class TEXT,
  inventory_slots INTEGER,
  supercharged_slots INTEGER,
  glyph_address TEXT,
  discovered_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS frigates (
  frigate_id INTEGER PRIMARY KEY,
  freighter_id INTEGER REFERENCES freighters(freighter_id) ON DELETE SET NULL,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  name TEXT,
  role TEXT,
  frigate_class TEXT,
  traits TEXT,
  discovered_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS bases (
  base_id INTEGER PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(planet_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner TEXT,
  platform TEXT,
  mode TEXT,
  portal_glyph_address TEXT,
  latitude REAL,
  longitude REAL,
  uploaded_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS missions (
  mission_id INTEGER PRIMARY KEY,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  station_id INTEGER REFERENCES space_stations(station_id) ON DELETE SET NULL,
  faction_id INTEGER REFERENCES factions(faction_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  mission_type TEXT,
  rank_requirement TEXT,
  reward TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS discoveries (
  discovery_id INTEGER PRIMARY KEY,
  galaxy_id INTEGER REFERENCES galaxies(galaxy_id) ON DELETE SET NULL,
  region_id INTEGER REFERENCES regions(region_id) ON DELETE SET NULL,
  system_id INTEGER REFERENCES star_systems(system_id) ON DELETE SET NULL,
  planet_id INTEGER REFERENCES planets(planet_id) ON DELETE SET NULL,
  discovery_type TEXT NOT NULL,
  name TEXT,
  discovered_by TEXT,
  discovered_at TEXT,
  source_url TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_galaxies_number ON galaxies(number);
CREATE INDEX IF NOT EXISTS idx_regions_galaxy ON regions(galaxy_id);
CREATE INDEX IF NOT EXISTS idx_systems_galaxy ON star_systems(galaxy_id);
CREATE INDEX IF NOT EXISTS idx_systems_region ON star_systems(region_id);
CREATE INDEX IF NOT EXISTS idx_planets_system ON planets(system_id);
CREATE INDEX IF NOT EXISTS idx_planet_resources_resource ON planet_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_discoveries_scope ON discoveries(galaxy_id, system_id, planet_id);
