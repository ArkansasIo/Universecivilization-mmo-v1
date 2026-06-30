// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE DATABASE SCHEMA — Sci-Fi MMORPG OGame-Style
// All tables, types, enums, RLS policies, and indexes
// Deploy these to Supabase SQL editor in order
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 1 — EXTENSIONS & ENUMS
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_ENUMS = `
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Rank enum
CREATE TYPE player_rank AS ENUM ('E','D','C','B','A','S','SS','SSS');

-- Rarity enum
CREATE TYPE item_rarity AS ENUM (
  'Common','Uncommon','Rare','Epic','Legendary','Mythic','Cosmic','Universal','Transcendent','Exotic'
);

-- Ship class enum
CREATE TYPE ship_class AS ENUM (
  'Fighter','Interceptor','Bomber','Corvette','Frigate','Destroyer',
  'Cruiser','Battlecruiser','Battleship','Dreadnought','Carrier',
  'Titan','Mothership','Flagship'
);

-- Ship category enum
CREATE TYPE ship_category AS ENUM (
  'Light','Medium','Heavy','Super Heavy','Capital','Super Capital','Legendary'
);

-- Ship type enum
CREATE TYPE ship_role AS ENUM (
  'Combat','Support','Stealth','Siege','Exploration','Mining','Transport','Hybrid'
);

-- Fleet status enum
CREATE TYPE fleet_status AS ENUM (
  'moving','returning','stationed','arrived','recalled','destroyed'
);

-- Mission type enum
CREATE TYPE mission_type AS ENUM (
  'attack','transport','deploy','stationing','spy','colonize',
  'harvest','destroy','expedition','alliance','raid'
);

-- Building category enum
CREATE TYPE building_category AS ENUM (
  'Civil','Military','Industrial','Infrastructure','Research',
  'Defense','Energy','Storage','Special'
);

-- Quest status enum
CREATE TYPE quest_status AS ENUM ('active','completed','claimed','failed','expired');

-- Alliance role enum
CREATE TYPE alliance_role AS ENUM ('founder','coleader','officer','veteran','member','recruit');

-- Diplomacy type enum
CREATE TYPE diplomacy_type AS ENUM ('ally','nap','war','neutral','pending');

-- Notification priority enum
CREATE TYPE notification_priority AS ENUM ('normal','high','urgent');

-- Planet type enum
CREATE TYPE planet_type AS ENUM (
  'terran','desert','ocean','ice','volcanic','gas_giant','rocky','jungle','barren','exotic'
);

-- Officer class enum
CREATE TYPE officer_class AS ENUM (
  'Admiral','Commander','Captain','Pilot','Engineer','Scientist',
  'Diplomat','Spy','Merchant','Strategist'
);

-- Research category enum
CREATE TYPE research_category AS ENUM (
  'Combat','Defense','Propulsion','Energy','Economic','Advanced',
  'Espionage','Weapons','Shields','Special'
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 2 — CORE PLAYER TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_PLAYER_TABLES = `
-- ── profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         VARCHAR(32) UNIQUE NOT NULL,
  avatar_url       TEXT,
  empire_name      VARCHAR(64),
  empire_color     VARCHAR(7) DEFAULT '#3B82F6',
  level            INT DEFAULT 1 CHECK (level BETWEEN 1 AND 150),
  experience       BIGINT DEFAULT 0,
  prestige         INT DEFAULT 0,
  skill_points     INT DEFAULT 0,
  title            VARCHAR(64) DEFAULT 'Novice Explorer',
  rank             player_rank DEFAULT 'E',
  total_points     BIGINT DEFAULT 0,
  fleet_points     BIGINT DEFAULT 0,
  research_points  BIGINT DEFAULT 0,
  economy_points   BIGINT DEFAULT 0,
  battles_won      INT DEFAULT 0,
  battles_lost     INT DEFAULT 0,
  planets_colonized INT DEFAULT 0,
  ships_built      INT DEFAULT 0,
  resources_mined  BIGINT DEFAULT 0,
  is_banned        BOOLEAN DEFAULT FALSE,
  ban_reason       TEXT,
  last_active      TIMESTAMPTZ DEFAULT NOW(),
  vacation_mode    BOOLEAN DEFAULT FALSE,
  vacation_until   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── player_settings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_settings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme                   VARCHAR(20) DEFAULT 'dark',
  language                VARCHAR(10) DEFAULT 'en',
  number_format           VARCHAR(20) DEFAULT 'compact',
  notify_fleet            BOOLEAN DEFAULT TRUE,
  notify_attack           BOOLEAN DEFAULT TRUE,
  notify_build            BOOLEAN DEFAULT TRUE,
  notify_research         BOOLEAN DEFAULT TRUE,
  notify_alliance         BOOLEAN DEFAULT TRUE,
  notify_quest            BOOLEAN DEFAULT TRUE,
  notify_email            BOOLEAN DEFAULT FALSE,
  confirm_fleet_send      BOOLEAN DEFAULT TRUE,
  confirm_building        BOOLEAN DEFAULT TRUE,
  show_tutorial           BOOLEAN DEFAULT TRUE,
  auto_save               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ── player_resources ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_resources (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metal             BIGINT DEFAULT 500 CHECK (metal >= 0),
  crystal           BIGINT DEFAULT 300 CHECK (crystal >= 0),
  deuterium         BIGINT DEFAULT 100 CHECK (deuterium >= 0),
  energy            BIGINT DEFAULT 0,
  dark_matter       BIGINT DEFAULT 0 CHECK (dark_matter >= 0),
  antimatter        BIGINT DEFAULT 0 CHECK (antimatter >= 0),
  nanites           BIGINT DEFAULT 0 CHECK (nanites >= 0),
  quantum_cores     INT DEFAULT 0 CHECK (quantum_cores >= 0),
  imperial_credits  BIGINT DEFAULT 10000 CHECK (imperial_credits >= 0),
  republic_credits  BIGINT DEFAULT 5000 CHECK (republic_credits >= 0),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── resource_transactions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resource_transactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(32) NOT NULL,
  amount        BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  source        VARCHAR(64) NOT NULL, -- 'mine','trade','combat','quest','purchase' etc.
  description   TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 3 — UNIVERSE & TERRITORY TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_UNIVERSE_TABLES = `
-- ── planets ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS planets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  player_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name              VARCHAR(64) NOT NULL DEFAULT 'Unnamed Planet',
  planet_type       planet_type DEFAULT 'terran',
  position_galaxy   INT DEFAULT 1 CHECK (position_galaxy BETWEEN 1 AND 9),
  position_system   INT DEFAULT 1 CHECK (position_system BETWEEN 1 AND 499),
  position_planet   INT DEFAULT 1 CHECK (position_planet BETWEEN 1 AND 15),
  coordinates       VARCHAR(32) GENERATED ALWAYS AS (
                      '[' || position_galaxy || ':' || position_system || ':' || position_planet || ']'
                    ) STORED,
  size              INT DEFAULT 163 CHECK (size BETWEEN 50 AND 300),
  temperature_max   INT DEFAULT 40,
  temperature_min   INT DEFAULT -10,
  diameter          INT DEFAULT 12800,
  metal_bonus       DECIMAL(3,2) DEFAULT 1.0,
  crystal_bonus     DECIMAL(3,2) DEFAULT 1.0,
  deuterium_bonus   DECIMAL(3,2) DEFAULT 1.0,
  build_slots       INT DEFAULT 163,
  used_slots        INT DEFAULT 0,
  is_homeworld      BOOLEAN DEFAULT FALSE,
  is_capital        BOOLEAN DEFAULT FALSE,
  destroyed         BOOLEAN DEFAULT FALSE,
  colonized_at      TIMESTAMPTZ DEFAULT NOW(),
  last_updated      TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── moons ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planet_id       UUID NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  owner_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name            VARCHAR(64) DEFAULT 'Moon',
  size            INT DEFAULT 8138,
  moon_type       VARCHAR(20) DEFAULT 'rocky',
  has_phalanx     BOOLEAN DEFAULT FALSE,
  has_jump_gate   BOOLEAN DEFAULT FALSE,
  phalanx_level   INT DEFAULT 0,
  jump_gate_level INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── population_data ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS population_data (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planet_id       UUID UNIQUE NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  population      BIGINT DEFAULT 100,
  max_population  BIGINT DEFAULT 1000,
  growth_rate     DECIMAL(4,2) DEFAULT 1.02,
  happiness       INT DEFAULT 100 CHECK (happiness BETWEEN 0 AND 100),
  employment_rate DECIMAL(3,2) DEFAULT 1.0,
  education_level INT DEFAULT 1,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── debris_fields ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS debris_fields (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_galaxy   INT NOT NULL,
  position_system   INT NOT NULL,
  position_planet   INT NOT NULL,
  metal             BIGINT DEFAULT 0,
  crystal           BIGINT DEFAULT 0,
  created_from_combat UUID,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(position_galaxy, position_system, position_planet)
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 4 — BUILDINGS, RESEARCH & SHIPS
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_INFRASTRUCTURE_TABLES = `
-- ── buildings ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buildings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  planet_id       UUID REFERENCES planets(id) ON DELETE CASCADE,
  building_type   VARCHAR(64) NOT NULL,
  category        building_category DEFAULT 'Civil',
  level           INT DEFAULT 0 CHECK (level >= 0),
  max_level       INT DEFAULT 30,
  is_building     BOOLEAN DEFAULT FALSE,
  start_time      TIMESTAMPTZ,
  end_time        TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, planet_id, building_type)
);

-- ── defense_structures ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS defense_structures (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  planet_id       UUID NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  structure_type  VARCHAR(64) NOT NULL,
  quantity        INT DEFAULT 0 CHECK (quantity >= 0),
  is_building     BOOLEAN DEFAULT FALSE,
  build_quantity  INT DEFAULT 0,
  start_time      TIMESTAMPTZ,
  end_time        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, planet_id, structure_type)
);

-- ── research ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technology_name  VARCHAR(64) NOT NULL,
  category         research_category DEFAULT 'Combat',
  level            INT DEFAULT 0 CHECK (level >= 0),
  max_level        INT DEFAULT 20,
  is_researching   BOOLEAN DEFAULT FALSE,
  start_time       TIMESTAMPTZ,
  end_time         TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, technology_name)
);

-- ── ships (inventory) ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ships (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  planet_id   UUID REFERENCES planets(id) ON DELETE SET NULL,
  ship_type   VARCHAR(64) NOT NULL,
  ship_class  ship_class,
  category    ship_category,
  role        ship_role DEFAULT 'Combat',
  quantity    INT DEFAULT 0 CHECK (quantity >= 0),
  level       INT DEFAULT 1,
  rarity      item_rarity DEFAULT 'Common',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, planet_id, ship_type)
);

-- ── ship_production ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ship_production (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  planet_id     UUID REFERENCES planets(id) ON DELETE SET NULL,
  ship_type     VARCHAR(64) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  produced      INT DEFAULT 0,
  time_per_ship INT NOT NULL,
  start_time    TIMESTAMPTZ DEFAULT NOW(),
  end_time      TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 5 — FLEET & COMBAT TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_FLEET_TABLES = `
-- ── fleets ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fleets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            VARCHAR(64),
  mission_type    mission_type NOT NULL,
  ships           JSONB NOT NULL DEFAULT '{}',
  cargo           JSONB DEFAULT '{"metal":0,"crystal":0,"deuterium":0}',
  origin          VARCHAR(32) NOT NULL,
  destination     VARCHAR(32) NOT NULL,
  target_player   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status          fleet_status DEFAULT 'moving',
  speed_pct       INT DEFAULT 100 CHECK (speed_pct BETWEEN 1 AND 100),
  departure_time  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  arrival_time    TIMESTAMPTZ NOT NULL,
  return_time     TIMESTAMPTZ,
  mission_data    JSONB DEFAULT '{}',
  fuel_used       INT DEFAULT 0,
  recalled        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── combat_logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS combat_logs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fleet_id          UUID REFERENCES fleets(id) ON DELETE SET NULL,
  attacker_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  defender_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  location          VARCHAR(32),
  attacker_ships    JSONB DEFAULT '{}',
  defender_ships    JSONB DEFAULT '{}',
  attacker_losses   JSONB DEFAULT '{}',
  defender_losses   JSONB DEFAULT '{}',
  rounds            INT DEFAULT 0,
  result            VARCHAR(20) CHECK (result IN ('victory','defeat','draw','retreat')),
  loot              JSONB DEFAULT '{"metal":0,"crystal":0,"deuterium":0}',
  debris            JSONB DEFAULT '{"metal":0,"crystal":0}',
  experience_gained INT DEFAULT 0,
  timestamp         TIMESTAMPTZ DEFAULT NOW()
);

-- ── espionage_reports ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS espionage_reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spy_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_planet   VARCHAR(32),
  resources       JSONB DEFAULT '{}',
  fleet           JSONB DEFAULT '{}',
  defenses        JSONB DEFAULT '{}',
  buildings       JSONB DEFAULT '{}',
  research        JSONB DEFAULT '{}',
  spy_level_used  INT DEFAULT 1,
  counter_chance  INT DEFAULT 0,
  detected        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 6 — QUESTS, ACHIEVEMENTS & PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_PROGRESSION_TABLES = `
-- ── quests ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id            VARCHAR(64) NOT NULL,
  title               VARCHAR(128),
  description         TEXT,
  category            VARCHAR(32) DEFAULT 'main',
  sub_category        VARCHAR(32),
  progress            INT DEFAULT 0,
  target              INT DEFAULT 1,
  completed           BOOLEAN DEFAULT FALSE,
  claimed             BOOLEAN DEFAULT FALSE,
  status              quest_status DEFAULT 'active',
  reward_credits      BIGINT DEFAULT 0,
  reward_experience   INT DEFAULT 0,
  reward_items        JSONB DEFAULT '[]',
  reward_dark_matter  INT DEFAULT 0,
  completed_at        TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, quest_id)
);

-- ── achievements ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id  VARCHAR(64) NOT NULL,
  title           VARCHAR(128),
  description     TEXT,
  category        VARCHAR(32),
  tier            INT DEFAULT 1,
  rank            player_rank DEFAULT 'E',
  progress        INT DEFAULT 0,
  max_progress    INT DEFAULT 1,
  completed       BOOLEAN DEFAULT FALSE,
  claimed         BOOLEAN DEFAULT FALSE,
  reward_type     VARCHAR(32),
  reward_value    TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

-- ── player_skills ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id    VARCHAR(64) NOT NULL,
  skill_name  VARCHAR(64),
  category    VARCHAR(32),
  level       INT DEFAULT 0,
  max_level   INT DEFAULT 10,
  unlocked    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, skill_id)
);

-- ── player_titles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_titles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       VARCHAR(64) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  is_active   BOOLEAN DEFAULT FALSE,
  UNIQUE(player_id, title)
);

-- ── season_pass ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS season_pass (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_number   INT DEFAULT 1,
  level           INT DEFAULT 0,
  experience      INT DEFAULT 0,
  is_premium      BOOLEAN DEFAULT FALSE,
  claimed_tiers   JSONB DEFAULT '[]',
  purchased_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 7 — ECONOMY & MARKET TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_ECONOMY_TABLES = `
-- ── player_inventory ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_inventory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id     VARCHAR(64) NOT NULL,
  item_name   VARCHAR(128),
  item_type   VARCHAR(32),
  category    VARCHAR(32),
  sub_category VARCHAR(32),
  rarity      item_rarity DEFAULT 'Common',
  quantity    INT DEFAULT 1 CHECK (quantity >= 0),
  level       INT DEFAULT 1,
  metadata    JSONB DEFAULT '{}',
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, item_id)
);

-- ── blueprints ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blueprints (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id    VARCHAR(64) NOT NULL,
  blueprint_name  VARCHAR(128),
  blueprint_type  VARCHAR(32),
  category        VARCHAR(32),
  rarity          item_rarity DEFAULT 'Common',
  tier            INT DEFAULT 1,
  quantity        INT DEFAULT 1,
  uses_remaining  INT,
  is_permanent    BOOLEAN DEFAULT FALSE,
  acquired_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, blueprint_id)
);

-- ── market_orders ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  item_id           VARCHAR(64) NOT NULL,
  item_name         VARCHAR(128),
  item_type         VARCHAR(32),
  rarity            item_rarity DEFAULT 'Common',
  order_type        VARCHAR(4) CHECK (order_type IN ('buy','sell')),
  quantity          INT NOT NULL CHECK (quantity > 0),
  remaining_qty     INT NOT NULL,
  price_per_unit    BIGINT NOT NULL CHECK (price_per_unit > 0),
  currency          VARCHAR(32) DEFAULT 'imperial_credits',
  total_value       BIGINT,
  status            VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','fulfilled','cancelled','expired')),
  expires_at        TIMESTAMPTZ,
  fulfilled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── auction_items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auction_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id         VARCHAR(64) NOT NULL,
  item_name       VARCHAR(128),
  item_type       VARCHAR(32),
  rarity          item_rarity DEFAULT 'Common',
  quantity        INT DEFAULT 1,
  starting_bid    BIGINT NOT NULL,
  current_bid     BIGINT,
  buyout_price    BIGINT,
  currency        VARCHAR(32) DEFAULT 'imperial_credits',
  top_bidder      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bid_count       INT DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'active',
  ends_at         TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── trade_routes ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trade_routes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            VARCHAR(64),
  origin          VARCHAR(32) NOT NULL,
  destination     VARCHAR(32) NOT NULL,
  resource_type   VARCHAR(32) NOT NULL,
  amount          INT NOT NULL,
  profit_rate     DECIMAL(4,2),
  last_run        TIMESTAMPTZ,
  next_run        TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  total_runs      INT DEFAULT 0,
  total_profit    BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── crafting_queue ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crafting_queue (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id       VARCHAR(64) NOT NULL,
  recipe_name     VARCHAR(128),
  category        VARCHAR(32),
  quantity        INT DEFAULT 1,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  end_time        TIMESTAMPTZ NOT NULL,
  completed       BOOLEAN DEFAULT FALSE,
  claimed         BOOLEAN DEFAULT FALSE
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 8 — SOCIAL & ALLIANCE TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_SOCIAL_TABLES = `
-- ── alliances ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alliances (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(64) UNIQUE NOT NULL,
  tag           VARCHAR(5) UNIQUE NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  color         VARCHAR(7) DEFAULT '#3B82F6',
  founder_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leader_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count  INT DEFAULT 1,
  max_members   INT DEFAULT 50,
  total_points  BIGINT DEFAULT 0,
  ranking       INT DEFAULT 0,
  is_recruiting BOOLEAN DEFAULT TRUE,
  min_points    INT DEFAULT 0,
  language      VARCHAR(10) DEFAULT 'en',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── alliance_members ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alliance_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alliance_id   UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  player_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          alliance_role DEFAULT 'member',
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  contribution  BIGINT DEFAULT 0,
  UNIQUE(alliance_id, player_id)
);

-- ── diplomacy ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diplomacy (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alliance_id     UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  target_id       UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  relation        diplomacy_type NOT NULL,
  proposed_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted        BOOLEAN DEFAULT FALSE,
  starts_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(alliance_id, target_id)
);

-- ── messages ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject     VARCHAR(128),
  body        TEXT NOT NULL,
  category    VARCHAR(32) DEFAULT 'personal',
  is_read     BOOLEAN DEFAULT FALSE,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        VARCHAR(64) NOT NULL,
  category    VARCHAR(32) DEFAULT 'other',
  title       VARCHAR(128) NOT NULL,
  message     TEXT,
  priority    notification_priority DEFAULT 'normal',
  is_read     BOOLEAN DEFAULT FALSE,
  link        VARCHAR(128),
  metadata    JSONB DEFAULT '{}',
  eta         TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 9 — OFFICERS, BOSSES & EVENTS
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_GAME_EVENTS_TABLES = `
-- ── player_officers ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_officers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  officer_id    VARCHAR(64) NOT NULL,
  officer_name  VARCHAR(64),
  class         officer_class DEFAULT 'Commander',
  level         INT DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  experience    INT DEFAULT 0,
  rarity        item_rarity DEFAULT 'Common',
  rank          player_rank DEFAULT 'E',
  is_active     BOOLEAN DEFAULT TRUE,
  assignment    VARCHAR(64),
  loyalty       INT DEFAULT 100 CHECK (loyalty BETWEEN 0 AND 100),
  morale        INT DEFAULT 100 CHECK (morale BETWEEN 0 AND 100),
  recruited_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, officer_id)
);

-- ── world_boss_records ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS world_boss_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id         VARCHAR(64) NOT NULL,
  boss_name       VARCHAR(128),
  season          INT DEFAULT 1,
  total_hp        BIGINT,
  current_hp      BIGINT,
  defeated        BOOLEAN DEFAULT FALSE,
  defeated_at     TIMESTAMPTZ,
  spawn_time      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  reward_pool     JSONB DEFAULT '{}'
);

-- ── world_boss_participants ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS world_boss_participants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_record_id  UUID NOT NULL REFERENCES world_boss_records(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  damage_dealt    BIGINT DEFAULT 0,
  contribution_pct DECIMAL(5,2) DEFAULT 0,
  rewarded        BOOLEAN DEFAULT FALSE,
  reward_claimed  BOOLEAN DEFAULT FALSE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(boss_record_id, player_id)
);

-- ── seasonal_events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seasonal_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        VARCHAR(64) UNIQUE NOT NULL,
  name            VARCHAR(128),
  description     TEXT,
  event_type      VARCHAR(32),
  category        VARCHAR(32),
  sub_category    VARCHAR(32),
  multipliers     JSONB DEFAULT '{}',
  rewards         JSONB DEFAULT '{}',
  is_active       BOOLEAN DEFAULT FALSE,
  starts_at       TIMESTAMPTZ,
  ends_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── pirate_raids ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pirate_raids (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_planet   VARCHAR(32),
  raid_strength   INT DEFAULT 1,
  ships           JSONB DEFAULT '{}',
  arrival_time    TIMESTAMPTZ,
  resolved        BOOLEAN DEFAULT FALSE,
  result          VARCHAR(20),
  loot            JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 10 — LEADERBOARD & ADMIN TABLES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_ADMIN_TABLES = `
-- ── leaderboard_cache ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username        VARCHAR(32),
  empire_name     VARCHAR(64),
  rank            player_rank DEFAULT 'E',
  total_points    BIGINT DEFAULT 0,
  fleet_points    BIGINT DEFAULT 0,
  research_points BIGINT DEFAULT 0,
  economy_points  BIGINT DEFAULT 0,
  fleet_rank      INT DEFAULT 0,
  research_rank   INT DEFAULT 0,
  economy_rank    INT DEFAULT 0,
  overall_rank    INT DEFAULT 0,
  alliance_tag    VARCHAR(5),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

-- ── admin_logs ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action      VARCHAR(64) NOT NULL,
  target_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details     JSONB DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── admin_roles ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        VARCHAR(32) DEFAULT 'moderator' CHECK (role IN ('superadmin','admin','moderator','support')),
  permissions JSONB DEFAULT '[]',
  granted_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 11 — ROW LEVEL SECURITY (RLS) POLICIES
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_RLS_POLICIES = `
-- Enable RLS on all tables
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_resources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE planets               ENABLE ROW LEVEL SECURITY;
ALTER TABLE moons                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE population_data       ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_structures    ENABLE ROW LEVEL SECURITY;
ALTER TABLE research              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_production       ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleets                ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE espionage_reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests                ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_titles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_pass           ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints            ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_routes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafting_queue        ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_officers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_boss_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_skills         ENABLE ROW LEVEL SECURITY;

-- ── profiles: public read, own write ─────────────────────────────────────────
CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_insert"   ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update"   ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── player_settings: own only ─────────────────────────────────────────────────
CREATE POLICY "settings_own_all" ON player_settings FOR ALL USING (auth.uid() = user_id);

-- ── player_resources: own only ────────────────────────────────────────────────
CREATE POLICY "resources_own_all" ON player_resources FOR ALL USING (auth.uid() = user_id OR auth.uid() = player_id);

-- ── resource_transactions: own read ───────────────────────────────────────────
CREATE POLICY "transactions_own_read" ON resource_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_own_insert" ON resource_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── planets: own write, public read ───────────────────────────────────────────
CREATE POLICY "planets_public_read"  ON planets FOR SELECT USING (true);
CREATE POLICY "planets_own_insert"   ON planets FOR INSERT WITH CHECK (auth.uid() = owner_id OR auth.uid() = player_id);
CREATE POLICY "planets_own_update"   ON planets FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = player_id);

-- ── moons: own only ───────────────────────────────────────────────────────────
CREATE POLICY "moons_own_all" ON moons FOR ALL USING (auth.uid() = owner_id);

-- ── population_data: own only ─────────────────────────────────────────────────
CREATE POLICY "population_own_all" ON population_data FOR ALL USING (
  auth.uid() = (SELECT owner_id FROM planets WHERE id = population_data.planet_id)
);

-- ── buildings: own only ───────────────────────────────────────────────────────
CREATE POLICY "buildings_own_all" ON buildings FOR ALL USING (auth.uid() = player_id OR auth.uid() = user_id);

-- ── defense_structures: own only ─────────────────────────────────────────────
CREATE POLICY "defenses_own_all" ON defense_structures FOR ALL USING (auth.uid() = player_id);

-- ── research: own only ────────────────────────────────────────────────────────
CREATE POLICY "research_own_all" ON research FOR ALL USING (auth.uid() = player_id);

-- ── ships: own only ───────────────────────────────────────────────────────────
CREATE POLICY "ships_own_all" ON ships FOR ALL USING (auth.uid() = player_id);

-- ── ship_production: own only ─────────────────────────────────────────────────
CREATE POLICY "ship_prod_own_all" ON ship_production FOR ALL USING (auth.uid() = player_id);

-- ── fleets: own insert/update, public read (for attack tracking) ──────────────
CREATE POLICY "fleets_own_write"  ON fleets FOR ALL USING (auth.uid() = player_id);

-- ── combat_logs: participants can read ────────────────────────────────────────
CREATE POLICY "combat_own_read" ON combat_logs FOR SELECT USING (auth.uid() = attacker_id OR auth.uid() = defender_id);
CREATE POLICY "combat_own_insert" ON combat_logs FOR INSERT WITH CHECK (auth.uid() = attacker_id);

-- ── espionage_reports: spy can read ───────────────────────────────────────────
CREATE POLICY "espionage_own_all" ON espionage_reports FOR ALL USING (auth.uid() = spy_id);

-- ── quests: own only ──────────────────────────────────────────────────────────
CREATE POLICY "quests_own_all" ON quests FOR ALL USING (auth.uid() = player_id);

-- ── achievements: own only ───────────────────────────────────────────────────
CREATE POLICY "achievements_own_all" ON achievements FOR ALL USING (auth.uid() = player_id);

-- ── player_skills: own only ───────────────────────────────────────────────────
CREATE POLICY "skills_own_all" ON player_skills FOR ALL USING (auth.uid() = player_id);

-- ── player_titles: own only ───────────────────────────────────────────────────
CREATE POLICY "titles_own_all" ON player_titles FOR ALL USING (auth.uid() = player_id);

-- ── season_pass: own only ─────────────────────────────────────────────────────
CREATE POLICY "season_own_all" ON season_pass FOR ALL USING (auth.uid() = player_id);

-- ── player_inventory: own only ────────────────────────────────────────────────
CREATE POLICY "inventory_own_all" ON player_inventory FOR ALL USING (auth.uid() = player_id);

-- ── blueprints: own only ─────────────────────────────────────────────────────
CREATE POLICY "blueprints_own_all" ON blueprints FOR ALL USING (auth.uid() = player_id);

-- ── market_orders: public read, own write ────────────────────────────────────
CREATE POLICY "market_public_read"  ON market_orders FOR SELECT USING (true);
CREATE POLICY "market_own_write"    ON market_orders FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "market_own_update"   ON market_orders FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- ── auction_items: public read, own write ────────────────────────────────────
CREATE POLICY "auction_public_read" ON auction_items FOR SELECT USING (true);
CREATE POLICY "auction_own_write"   ON auction_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "auction_own_update"  ON auction_items FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = top_bidder);

-- ── trade_routes: own only ───────────────────────────────────────────────────
CREATE POLICY "routes_own_all" ON trade_routes FOR ALL USING (auth.uid() = player_id);

-- ── crafting_queue: own only ─────────────────────────────────────────────────
CREATE POLICY "crafting_own_all" ON crafting_queue FOR ALL USING (auth.uid() = player_id);

-- ── messages: sender and receiver can read ────────────────────────────────────
CREATE POLICY "messages_own_read"   ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_own_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_own_update" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ── notifications: own only ───────────────────────────────────────────────────
CREATE POLICY "notifications_own_all" ON notifications FOR ALL USING (auth.uid() = player_id);

-- ── player_officers: own only ─────────────────────────────────────────────────
CREATE POLICY "officers_own_all" ON player_officers FOR ALL USING (auth.uid() = player_id);

-- ── world_boss_participants: own only ────────────────────────────────────────
CREATE POLICY "boss_part_own_all" ON world_boss_participants FOR ALL USING (auth.uid() = player_id);

-- ── world_boss_records: public read ──────────────────────────────────────────
CREATE POLICY "boss_records_public_read" ON world_boss_records FOR SELECT USING (true);

-- ── alliances: public read, member write ─────────────────────────────────────
CREATE POLICY "alliances_public_read" ON alliances FOR SELECT USING (true);
CREATE POLICY "alliances_founder_write" ON alliances FOR INSERT WITH CHECK (auth.uid() = founder_id);
CREATE POLICY "alliances_leader_update" ON alliances FOR UPDATE USING (auth.uid() = leader_id);

-- ── alliance_members: member read ────────────────────────────────────────────
CREATE POLICY "alliance_members_read" ON alliance_members FOR SELECT USING (true);
CREATE POLICY "alliance_members_own_write" ON alliance_members FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "alliance_members_own_delete" ON alliance_members FOR DELETE USING (auth.uid() = player_id);

-- ── leaderboard: public read ─────────────────────────────────────────────────
CREATE POLICY "leaderboard_public_read" ON leaderboard_cache FOR SELECT USING (true);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 12 — INDEXES FOR PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_INDEXES = `
-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);

-- Planets
CREATE INDEX IF NOT EXISTS idx_planets_owner ON planets(owner_id);
CREATE INDEX IF NOT EXISTS idx_planets_coords ON planets(position_galaxy, position_system, position_planet);

-- Buildings
CREATE INDEX IF NOT EXISTS idx_buildings_player ON buildings(player_id);
CREATE INDEX IF NOT EXISTS idx_buildings_planet ON buildings(planet_id);
CREATE INDEX IF NOT EXISTS idx_buildings_building ON buildings(player_id, building_type);

-- Research
CREATE INDEX IF NOT EXISTS idx_research_player ON research(player_id);
CREATE INDEX IF NOT EXISTS idx_research_tech ON research(player_id, technology_name);

-- Ships
CREATE INDEX IF NOT EXISTS idx_ships_player ON ships(player_id);
CREATE INDEX IF NOT EXISTS idx_ships_planet ON ships(planet_id);

-- Fleets
CREATE INDEX IF NOT EXISTS idx_fleets_player ON fleets(player_id);
CREATE INDEX IF NOT EXISTS idx_fleets_status ON fleets(status);
CREATE INDEX IF NOT EXISTS idx_fleets_arrival ON fleets(arrival_time);

-- Combat
CREATE INDEX IF NOT EXISTS idx_combat_attacker ON combat_logs(attacker_id);
CREATE INDEX IF NOT EXISTS idx_combat_defender ON combat_logs(defender_id);
CREATE INDEX IF NOT EXISTS idx_combat_timestamp ON combat_logs(timestamp DESC);

-- Quests
CREATE INDEX IF NOT EXISTS idx_quests_player ON quests(player_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(player_id, status);

-- Market
CREATE INDEX IF NOT EXISTS idx_market_seller ON market_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_status ON market_orders(status);
CREATE INDEX IF NOT EXISTS idx_market_item ON market_orders(item_id, status);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_player ON notifications(player_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- Leaderboard
CREATE INDEX IF NOT EXISTS idx_leaderboard_overall ON leaderboard_cache(overall_rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard_cache(total_points DESC);

-- Alliance
CREATE INDEX IF NOT EXISTS idx_alliance_members_alliance ON alliance_members(alliance_id);
CREATE INDEX IF NOT EXISTS idx_alliance_members_player ON alliance_members(player_id);
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 13 — TRIGGERS & FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_TRIGGERS = `
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON player_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON player_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_buildings_updated_at
  BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_research_updated_at
  BEFORE UPDATE ON research FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ships_updated_at
  BEFORE UPDATE ON ships FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, empire_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Commander_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'empire_name', 'New Empire')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.player_resources (user_id, player_id)
  VALUES (NEW.id, NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.player_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`;

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT: Full ordered schema to run in Supabase SQL editor
// ─────────────────────────────────────────────────────────────────────────────
export const FULL_SCHEMA_ORDERED = [
  { name: 'Enums & Extensions',         sql: SQL_ENUMS               },
  { name: 'Player Tables',              sql: SQL_PLAYER_TABLES        },
  { name: 'Universe & Territory',       sql: SQL_UNIVERSE_TABLES      },
  { name: 'Infrastructure',             sql: SQL_INFRASTRUCTURE_TABLES},
  { name: 'Fleet & Combat',             sql: SQL_FLEET_TABLES         },
  { name: 'Progression',                sql: SQL_PROGRESSION_TABLES   },
  { name: 'Economy & Market',           sql: SQL_ECONOMY_TABLES       },
  { name: 'Social & Alliances',         sql: SQL_SOCIAL_TABLES        },
  { name: 'Events & Officers',          sql: SQL_GAME_EVENTS_TABLES   },
  { name: 'Admin & Leaderboard',        sql: SQL_ADMIN_TABLES         },
  { name: 'RLS Policies',               sql: SQL_RLS_POLICIES         },
  { name: 'Indexes',                    sql: SQL_INDEXES              },
  { name: 'Triggers & Functions',       sql: SQL_TRIGGERS             },
] as const;
