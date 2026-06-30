// OGame-style artwork registry
// Each entry maps to a Stable Diffusion generated image

export interface ArtworkEntry {
  url: string;
  alt: string;
}

const BASE = 'https://readdy.ai/api/search-image';

// ── Buildings ──────────────────────────────────────────────────────────────
export const BUILDING_ART: Record<string, ArtworkEntry> = {
  metal_mine: {
    url: `${BASE}?query=futuristic metal mine facility underground excavation massive drilling machines industrial sci-fi game art dark rocky terrain glowing ore veins detailed illustration ogame style&width=400&height=240&seq=bld_metal_mine&orientation=landscape`,
    alt: 'Metal Mine',
  },
  crystal_mine: {
    url: `${BASE}?query=futuristic crystal mine facility glowing blue crystal formations underground cavern sci-fi game art laser cutting machines detailed illustration ogame style&width=400&height=240&seq=bld_crystal_mine&orientation=landscape`,
    alt: 'Crystal Mine',
  },
  deuterium_synthesizer: {
    url: `${BASE}?query=futuristic deuterium synthesizer facility green glowing liquid tanks pipes industrial sci-fi game art chemical processing plant detailed illustration ogame style&width=400&height=240&seq=bld_deuterium&orientation=landscape`,
    alt: 'Deuterium Synthesizer',
  },
  solar_plant: {
    url: `${BASE}?query=futuristic solar power plant massive solar panels array energy collectors sci-fi game art glowing energy beams desert planet surface detailed illustration ogame style&width=400&height=240&seq=bld_solar&orientation=landscape`,
    alt: 'Solar Plant',
  },
  fusion_reactor: {
    url: `${BASE}?query=futuristic fusion reactor facility glowing plasma core tokamak magnetic containment sci-fi game art energy beams detailed illustration ogame style&width=400&height=240&seq=bld_fusion&orientation=landscape`,
    alt: 'Fusion Reactor',
  },
  robotics_factory: {
    url: `${BASE}?query=futuristic robotics factory assembly line robots manufacturing machines sci-fi game art industrial automation detailed illustration ogame style&width=400&height=240&seq=bld_robotics&orientation=landscape`,
    alt: 'Robotics Factory',
  },
  shipyard: {
    url: `${BASE}?query=futuristic shipyard massive space dock construction bay starships being built scaffolding sci-fi game art detailed illustration ogame style&width=400&height=240&seq=bld_shipyard&orientation=landscape`,
    alt: 'Shipyard',
  },
  research_lab: {
    url: `${BASE}?query=futuristic research laboratory holographic displays scientists working advanced technology sci-fi game art glowing equipment detailed illustration ogame style&width=400&height=240&seq=bld_research&orientation=landscape`,
    alt: 'Research Lab',
  },
  metal_storage: {
    url: `${BASE}?query=futuristic metal storage facility massive silos warehouses industrial sci-fi game art stacked metal ingots conveyor belts detailed illustration ogame style&width=400&height=240&seq=bld_metal_storage&orientation=landscape`,
    alt: 'Metal Storage',
  },
  crystal_storage: {
    url: `${BASE}?query=futuristic crystal storage facility glowing crystal containers vault sci-fi game art blue light detailed illustration ogame style&width=400&height=240&seq=bld_crystal_storage&orientation=landscape`,
    alt: 'Crystal Storage',
  },
  deuterium_tank: {
    url: `${BASE}?query=futuristic deuterium storage tank facility large pressurized containers green glow sci-fi game art industrial detailed illustration ogame style&width=400&height=240&seq=bld_deut_tank&orientation=landscape`,
    alt: 'Deuterium Tank',
  },
  nanite_factory: {
    url: `${BASE}?query=futuristic nanite factory microscopic robots swarm glowing blue nanobots manufacturing sci-fi game art advanced technology detailed illustration ogame style&width=400&height=240&seq=bld_nanite&orientation=landscape`,
    alt: 'Nanite Factory',
  },
  missile_silo: {
    url: `${BASE}?query=futuristic missile silo underground launch facility nuclear warheads sci-fi game art military installation detailed illustration ogame style&width=400&height=240&seq=bld_missile&orientation=landscape`,
    alt: 'Missile Silo',
  },
  defense_bunker: {
    url: `${BASE}?query=futuristic defense bunker fortified military base shields energy barriers sci-fi game art armored walls detailed illustration ogame style&width=400&height=240&seq=bld_bunker&orientation=landscape`,
    alt: 'Defense Bunker',
  },
  terraformer: {
    url: `${BASE}?query=futuristic terraformer machine massive device transforming planet surface atmosphere generators sci-fi game art detailed illustration ogame style&width=400&height=240&seq=bld_terra&orientation=landscape`,
    alt: 'Terraformer',
  },
  alliance_depot: {
    url: `${BASE}?query=futuristic alliance depot space station supply hub trading post sci-fi game art detailed illustration ogame style&width=400&height=240&seq=bld_alliance&orientation=landscape`,
    alt: 'Alliance Depot',
  },
};

// ── Ships ──────────────────────────────────────────────────────────────────
export const SHIP_ART: Record<string, ArtworkEntry> = {
  light_fighter: {
    url: `${BASE}?query=futuristic light fighter spacecraft small agile single pilot cockpit laser cannons sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_light_fighter&orientation=landscape`,
    alt: 'Light Fighter',
  },
  heavy_fighter: {
    url: `${BASE}?query=futuristic heavy fighter spacecraft armored twin engines heavy cannons sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_heavy_fighter&orientation=landscape`,
    alt: 'Heavy Fighter',
  },
  cruiser: {
    url: `${BASE}?query=futuristic cruiser warship medium class multiple turrets sleek design sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_cruiser&orientation=landscape`,
    alt: 'Cruiser',
  },
  battleship: {
    url: `${BASE}?query=futuristic battleship massive warship heavy armor multiple gun turrets imposing sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_battleship&orientation=landscape`,
    alt: 'Battleship',
  },
  battlecruiser: {
    url: `${BASE}?query=futuristic battlecruiser hybrid warship fast heavy weapons advanced design sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_battlecruiser&orientation=landscape`,
    alt: 'Battlecruiser',
  },
  bomber: {
    url: `${BASE}?query=futuristic bomber spacecraft heavy payload bomb bays planetary assault sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_bomber&orientation=landscape`,
    alt: 'Bomber',
  },
  destroyer: {
    url: `${BASE}?query=futuristic destroyer warship long sleek hull massive railguns sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_destroyer&orientation=landscape`,
    alt: 'Destroyer',
  },
  death_star: {
    url: `${BASE}?query=futuristic death star massive spherical superweapon planet destroyer beam weapon sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_deathstar&orientation=landscape`,
    alt: 'Death Star',
  },
  small_cargo: {
    url: `${BASE}?query=futuristic small cargo ship transport vessel cargo containers sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_small_cargo&orientation=landscape`,
    alt: 'Small Cargo',
  },
  large_cargo: {
    url: `${BASE}?query=futuristic large cargo freighter massive transport ship cargo bay sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_large_cargo&orientation=landscape`,
    alt: 'Large Cargo',
  },
  colony_ship: {
    url: `${BASE}?query=futuristic colony ship massive generation ship colonists habitation modules sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_colony&orientation=landscape`,
    alt: 'Colony Ship',
  },
  recycler: {
    url: `${BASE}?query=futuristic recycler ship debris collector salvage vessel mechanical arms sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_recycler&orientation=landscape`,
    alt: 'Recycler',
  },
  espionage_probe: {
    url: `${BASE}?query=futuristic espionage probe tiny stealth drone surveillance satellite sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_probe&orientation=landscape`,
    alt: 'Espionage Probe',
  },
  solar_satellite: {
    url: `${BASE}?query=futuristic solar satellite energy collector orbital power station solar panels sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_solar_sat&orientation=landscape`,
    alt: 'Solar Satellite',
  },
  // Generic fallbacks by type
  fighter: {
    url: `${BASE}?query=futuristic fighter spacecraft agile combat vessel laser weapons sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_fighter_gen&orientation=landscape`,
    alt: 'Fighter',
  },
  transport: {
    url: `${BASE}?query=futuristic transport ship cargo freighter space hauler sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_transport_gen&orientation=landscape`,
    alt: 'Transport',
  },
  warship: {
    url: `${BASE}?query=futuristic warship heavy combat vessel armored hull weapons systems sci-fi game art space background detailed illustration ogame style&width=400&height=240&seq=ship_warship_gen&orientation=landscape`,
    alt: 'Warship',
  },
};

// ── Research / Technologies ────────────────────────────────────────────────
export const RESEARCH_ART: Record<string, ArtworkEntry> = {
  espionage_technology: {
    url: `${BASE}?query=futuristic espionage technology holographic surveillance network spy satellites sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_espionage&orientation=landscape`,
    alt: 'Espionage Technology',
  },
  computer_technology: {
    url: `${BASE}?query=futuristic computer technology quantum processors neural networks holographic displays sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_computer&orientation=landscape`,
    alt: 'Computer Technology',
  },
  weapons_technology: {
    url: `${BASE}?query=futuristic weapons technology advanced plasma cannons railguns energy weapons sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_weapons&orientation=landscape`,
    alt: 'Weapons Technology',
  },
  shielding_technology: {
    url: `${BASE}?query=futuristic shielding technology energy shield generators force fields sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_shielding&orientation=landscape`,
    alt: 'Shielding Technology',
  },
  armor_technology: {
    url: `${BASE}?query=futuristic armor technology advanced hull plating nanocomposite materials sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_armor&orientation=landscape`,
    alt: 'Armor Technology',
  },
  hyperspace_technology: {
    url: `${BASE}?query=futuristic hyperspace technology warp drive jump gate portal sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_hyperspace&orientation=landscape`,
    alt: 'Hyperspace Technology',
  },
  combustion_drive: {
    url: `${BASE}?query=futuristic combustion drive rocket engine thruster exhaust plume sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_combustion&orientation=landscape`,
    alt: 'Combustion Drive',
  },
  impulse_drive: {
    url: `${BASE}?query=futuristic impulse drive ion engine blue glow propulsion system sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_impulse&orientation=landscape`,
    alt: 'Impulse Drive',
  },
  hyperspace_drive: {
    url: `${BASE}?query=futuristic hyperspace drive warp engine space folding technology sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_hyper_drive&orientation=landscape`,
    alt: 'Hyperspace Drive',
  },
  laser_technology: {
    url: `${BASE}?query=futuristic laser technology high powered laser beam cutting weapon sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_laser&orientation=landscape`,
    alt: 'Laser Technology',
  },
  ion_technology: {
    url: `${BASE}?query=futuristic ion technology ion cannon charged particle beam weapon sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_ion&orientation=landscape`,
    alt: 'Ion Technology',
  },
  plasma_technology: {
    url: `${BASE}?query=futuristic plasma technology plasma cannon superheated gas weapon sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_plasma&orientation=landscape`,
    alt: 'Plasma Technology',
  },
  intergalactic_research: {
    url: `${BASE}?query=futuristic intergalactic research network galaxy map star charts sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_intergalactic&orientation=landscape`,
    alt: 'Intergalactic Research',
  },
  graviton_technology: {
    url: `${BASE}?query=futuristic graviton technology gravity manipulation black hole generator sci-fi game art detailed illustration ogame style&width=400&height=240&seq=res_graviton&orientation=landscape`,
    alt: 'Graviton Technology',
  },
};

// ── Defense ────────────────────────────────────────────────────────────────
export const DEFENSE_ART: Record<string, ArtworkEntry> = {
  rocket_launcher: {
    url: `${BASE}?query=futuristic rocket launcher defense turret missile battery planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_rocket&orientation=landscape`,
    alt: 'Rocket Launcher',
  },
  light_laser: {
    url: `${BASE}?query=futuristic light laser turret defense cannon energy beam planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_light_laser&orientation=landscape`,
    alt: 'Light Laser',
  },
  heavy_laser: {
    url: `${BASE}?query=futuristic heavy laser cannon massive defense turret powerful energy beam planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_heavy_laser&orientation=landscape`,
    alt: 'Heavy Laser',
  },
  gauss_cannon: {
    url: `${BASE}?query=futuristic gauss cannon electromagnetic railgun defense turret planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_gauss&orientation=landscape`,
    alt: 'Gauss Cannon',
  },
  ion_cannon: {
    url: `${BASE}?query=futuristic ion cannon defense turret charged particle beam planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_ion&orientation=landscape`,
    alt: 'Ion Cannon',
  },
  plasma_turret: {
    url: `${BASE}?query=futuristic plasma turret defense cannon superheated plasma ball planetary defense sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_plasma&orientation=landscape`,
    alt: 'Plasma Turret',
  },
  small_shield_dome: {
    url: `${BASE}?query=futuristic small shield dome energy barrier planetary defense force field sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_small_shield&orientation=landscape`,
    alt: 'Small Shield Dome',
  },
  large_shield_dome: {
    url: `${BASE}?query=futuristic large shield dome massive energy barrier planetary defense force field sci-fi game art detailed illustration ogame style&width=400&height=240&seq=def_large_shield&orientation=landscape`,
    alt: 'Large Shield Dome',
  },
};

// ── Planets ────────────────────────────────────────────────────────────────
export const PLANET_ART: Record<string, ArtworkEntry> = {
  homeworld: {
    url: `${BASE}?query=futuristic homeworld planet blue green continents oceans atmosphere space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_home&orientation=landscape`,
    alt: 'Homeworld',
  },
  desert: {
    url: `${BASE}?query=futuristic desert planet orange sandy surface dunes craters space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_desert&orientation=landscape`,
    alt: 'Desert Planet',
  },
  ice: {
    url: `${BASE}?query=futuristic ice planet frozen white blue surface glaciers space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_ice&orientation=landscape`,
    alt: 'Ice Planet',
  },
  volcanic: {
    url: `${BASE}?query=futuristic volcanic planet lava flows dark rock glowing magma space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_volcanic&orientation=landscape`,
    alt: 'Volcanic Planet',
  },
  jungle: {
    url: `${BASE}?query=futuristic jungle planet dense green vegetation tropical atmosphere space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_jungle&orientation=landscape`,
    alt: 'Jungle Planet',
  },
  gas_giant: {
    url: `${BASE}?query=futuristic gas giant planet orange brown banded atmosphere storm systems space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_gas&orientation=landscape`,
    alt: 'Gas Giant',
  },
  ocean: {
    url: `${BASE}?query=futuristic ocean planet deep blue water surface white clouds space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_ocean&orientation=landscape`,
    alt: 'Ocean Planet',
  },
  barren: {
    url: `${BASE}?query=futuristic barren rocky planet grey cratered surface no atmosphere space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_barren&orientation=landscape`,
    alt: 'Barren Planet',
  },
};

// ── Helper: get ship art by name (fuzzy match) ─────────────────────────────
export function getShipArt(name: string): ArtworkEntry {
  const key = name.toLowerCase().replace(/\s+/g, '_');
  if (SHIP_ART[key]) return SHIP_ART[key];

  // Fuzzy match
  if (key.includes('light') && key.includes('fighter')) return SHIP_ART.light_fighter;
  if (key.includes('heavy') && key.includes('fighter')) return SHIP_ART.heavy_fighter;
  if (key.includes('cruiser')) return SHIP_ART.cruiser;
  if (key.includes('battleship')) return SHIP_ART.battleship;
  if (key.includes('battlecruiser')) return SHIP_ART.battlecruiser;
  if (key.includes('bomber')) return SHIP_ART.bomber;
  if (key.includes('destroyer')) return SHIP_ART.destroyer;
  if (key.includes('death') || key.includes('star')) return SHIP_ART.death_star;
  if (key.includes('small') && key.includes('cargo')) return SHIP_ART.small_cargo;
  if (key.includes('large') && key.includes('cargo')) return SHIP_ART.large_cargo;
  if (key.includes('colony')) return SHIP_ART.colony_ship;
  if (key.includes('recycler')) return SHIP_ART.recycler;
  if (key.includes('probe')) return SHIP_ART.espionage_probe;
  if (key.includes('satellite')) return SHIP_ART.solar_satellite;
  if (key.includes('fighter')) return SHIP_ART.fighter;
  if (key.includes('transport') || key.includes('cargo')) return SHIP_ART.transport;

  return SHIP_ART.warship;
}

export function getBuildingArt(id: string): ArtworkEntry {
  return BUILDING_ART[id] ?? BUILDING_ART.metal_mine;
}

export function getResearchArt(id: string): ArtworkEntry {
  const key = id.toLowerCase().replace(/\s+/g, '_');
  return RESEARCH_ART[key] ?? RESEARCH_ART.computer_technology;
}

export function getDefenseArt(id: string): ArtworkEntry {
  const key = id.toLowerCase().replace(/\s+/g, '_');
  return DEFENSE_ART[key] ?? DEFENSE_ART.rocket_launcher;
}

// ── Megastructures ─────────────────────────────────────────────────────────
export const MEGASTRUCTURE_ART: Record<string, ArtworkEntry> = {
  dyson_sphere: {
    url: `${BASE}?query=futuristic dyson sphere massive energy collection megastructure surrounding sun star giant orbital structure sci-fi game art ogame style detailed illustration glowing energy panels space background&width=400&height=240&seq=mega_dyson&orientation=landscape`,
    alt: 'Dyson Sphere',
  },
  ringworld: {
    url: `${BASE}?query=futuristic ringworld massive orbital ring around star habitable band green continents sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=mega_ring&orientation=landscape`,
    alt: 'Ringworld',
  },
  stellar_forge: {
    url: `${BASE}?query=futuristic stellar forge massive space construction facility star factory plasma jets forging energy sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_forge&orientation=landscape`,
    alt: 'Stellar Forge',
  },
  space_elevator: {
    url: `${BASE}?query=futuristic space elevator giant cable connecting planet surface to orbit tether station sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_elevator&orientation=landscape`,
    alt: 'Space Elevator',
  },
  warp_gate: {
    url: `${BASE}?query=futuristic warp gate massive portal ring in space blue energy vortex ships passing through sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_warp&orientation=landscape`,
    alt: 'Warp Gate',
  },
  orbital_platform: {
    url: `${BASE}?query=futuristic orbital platform massive space station ring habitation modules solar panels docking bays sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_orbital&orientation=landscape`,
    alt: 'Orbital Platform',
  },
  quantum_relay: {
    url: `${BASE}?query=futuristic quantum relay communication array massive dish antenna network glowing energy beams sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_relay&orientation=landscape`,
    alt: 'Quantum Relay',
  },
  matter_fabricator: {
    url: `${BASE}?query=futuristic matter fabricator giant manufacturing complex molecular assembly station sci-fi game art detailed illustration ogame style&width=400&height=240&seq=mega_fab&orientation=landscape`,
    alt: 'Matter Fabricator',
  },
};

// ── Starbases ──────────────────────────────────────────────────────────────
export const STARBASE_ART: Record<string, ArtworkEntry> = {
  outpost: {
    url: `${BASE}?query=futuristic small space outpost station basic modules solar panels docking ring sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=sb_outpost&orientation=landscape`,
    alt: 'Outpost',
  },
  fortress: {
    url: `${BASE}?query=futuristic space fortress armored station heavy weapons turrets shields military sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=sb_fortress&orientation=landscape`,
    alt: 'Space Fortress',
  },
  trading_hub: {
    url: `${BASE}?query=futuristic space trading hub commercial station docking bays cargo ships busy market sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=sb_trade&orientation=landscape`,
    alt: 'Trading Hub',
  },
  research_station: {
    url: `${BASE}?query=futuristic orbital research station science modules laboratory telescopes experimental equipment sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=sb_research&orientation=landscape`,
    alt: 'Research Station',
  },
  command_center: {
    url: `${BASE}?query=futuristic military command center space station massive fortified command hub fleet coordination sci-fi game art ogame style detailed illustration space background&width=400&height=240&seq=sb_command&orientation=landscape`,
    alt: 'Command Center',
  },
};

// ── Officers / Characters ──────────────────────────────────────────────────
export const OFFICER_ART: Record<string, ArtworkEntry> = {
  commander: {
    url: `${BASE}?query=futuristic space fleet commander portrait military uniform tactical armor glowing rank insignia stern expression sci-fi game art character portrait dark background detailed illustration&width=300&height=360&seq=officer_commander&orientation=portrait`,
    alt: 'Fleet Commander',
  },
  admiral: {
    url: `${BASE}?query=futuristic space admiral portrait experienced military leader holographic displays war room command uniform sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_admiral&orientation=portrait`,
    alt: 'Admiral',
  },
  engineer: {
    url: `${BASE}?query=futuristic space engineer portrait technical expert tools gadgets mechanical arm cybernetic enhancements sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_engineer&orientation=portrait`,
    alt: 'Chief Engineer',
  },
  scientist: {
    url: `${BASE}?query=futuristic space scientist portrait research lab coat holographic data screens experiments quantum technology sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_scientist&orientation=portrait`,
    alt: 'Lead Scientist',
  },
  spy_master: {
    url: `${BASE}?query=futuristic spy master intelligence officer portrait shadowy dark cloak cybernetic eye implant mysterious sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_spy&orientation=portrait`,
    alt: 'Spy Master',
  },
  diplomat: {
    url: `${BASE}?query=futuristic space diplomat ambassador portrait elegant robes diplomatic attire alien cultural symbols sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_diplomat&orientation=portrait`,
    alt: 'Diplomat',
  },
  geologist: {
    url: `${BASE}?query=futuristic space geologist mining expert portrait rugged terrain suit geological scanner tools rock samples sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_geologist&orientation=portrait`,
    alt: 'Geologist',
  },
  fleet_captain: {
    url: `${BASE}?query=futuristic starship captain portrait bridge commander holographic star charts space uniform confident leadership sci-fi game art character portrait detailed illustration&width=300&height=360&seq=officer_captain&orientation=portrait`,
    alt: 'Fleet Captain',
  },
};

// ── Hero / Banner Images ───────────────────────────────────────────────────
export const HERO_ART: Record<string, ArtworkEntry> = {
  leaderboard: {
    url: `${BASE}?query=epic space arena champions podium galactic tournament top commanders holographic trophy rankings sci-fi cinematic wide angle dramatic lighting cosmic backdrop&width=1920&height=600&seq=hero_leaderboard&orientation=landscape`,
    alt: 'Leaderboard',
  },
  fleet: {
    url: `${BASE}?query=massive space fleet armada formation hundreds of warships cruisers fighters deep space nebula background cinematic military sci-fi wide angle dramatic lighting&width=1920&height=600&seq=hero_fleet&orientation=landscape`,
    alt: 'Fleet Command',
  },
  research: {
    url: `${BASE}?query=futuristic space research laboratory holographic data floating equations quantum experiments scientists glowing displays sci-fi cinematic wide angle&width=1920&height=600&seq=hero_research&orientation=landscape`,
    alt: 'Research Lab',
  },
  buildings: {
    url: `${BASE}?query=futuristic planetary colony base industrial complex mines refineries shipyards glowing structures sci-fi cinematic panorama wide angle planet surface&width=1920&height=600&seq=hero_buildings&orientation=landscape`,
    alt: 'Colony Buildings',
  },
  shipyard: {
    url: `${BASE}?query=massive futuristic space shipyard construction dock starship being assembled scaffolding cranes robotic arms glowing welds sci-fi cinematic wide angle&width=1920&height=600&seq=hero_shipyard&orientation=landscape`,
    alt: 'Shipyard',
  },
  alliance: {
    url: `${BASE}?query=epic galactic alliance meeting chamber commanders from different empires holographic star map council chamber sci-fi cinematic wide angle diplomacy&width=1920&height=600&seq=hero_alliance&orientation=landscape`,
    alt: 'Alliance',
  },
  espionage: {
    url: `${BASE}?query=futuristic space espionage intelligence center holographic surveillance network spy satellites stealth ships dark atmosphere sci-fi cinematic wide angle&width=1920&height=600&seq=hero_espionage&orientation=landscape`,
    alt: 'Espionage',
  },
  achievements: {
    url: `${BASE}?query=futuristic achievement hall of fame galactic trophies medals glowing awards space commander ceremony sci-fi cinematic wide angle dramatic lighting&width=1920&height=600&seq=hero_achieve&orientation=landscape`,
    alt: 'Achievements',
  },
  war_room: {
    url: `${BASE}?query=futuristic military war room battle planning holographic galaxy map commanders analyzing fleet positions tactical displays sci-fi cinematic wide angle&width=1920&height=600&seq=hero_warroom&orientation=landscape`,
    alt: 'War Room',
  },
  universe: {
    url: `${BASE}?query=vast infinite universe panoramic view multiple galaxies nebulae star clusters cosmic dust dark matter breathtaking astronomy sci-fi cinematic ultra wide&width=1920&height=600&seq=hero_universe&orientation=landscape`,
    alt: 'Universe',
  },
  officers: {
    url: `${BASE}?query=futuristic space military officer corps portraits diverse commanders specialists crew members holographic display background sci-fi cinematic wide angle&width=1920&height=600&seq=hero_officers&orientation=landscape`,
    alt: 'Officers',
  },
  crafting: {
    url: `${BASE}?query=futuristic space crafting workshop advanced fabrication lab molecular assembly machines glowing materials sci-fi cinematic wide angle&width=1920&height=600&seq=hero_craft&orientation=landscape`,
    alt: 'Crafting',
  },
  market: {
    url: `${BASE}?query=futuristic space marketplace trading hub holographic price displays merchants diverse alien traders galactic exchange sci-fi cinematic wide angle&width=1920&height=600&seq=hero_market&orientation=landscape`,
    alt: 'Marketplace',
  },
  colony: {
    url: `${BASE}?query=futuristic colonial outpost panoramic view multiple planet domes habitation modules alien landscape terraforming equipment sci-fi cinematic wide angle&width=1920&height=600&seq=hero_colony&orientation=landscape`,
    alt: 'Colonies',
  },
};

// ── Colony Type Images ─────────────────────────────────────────────────────
export const COLONY_ART: Record<string, ArtworkEntry> = {
  homeworld: {
    url: `${BASE}?query=futuristic advanced homeworld city spires towers blue green continents oceans atmosphere glow from space sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_home&orientation=landscape`,
    alt: 'Homeworld',
  },
  mining_colony: {
    url: `${BASE}?query=futuristic mining colony orange desert planet industrial drilling equipment ore extractors conveyors facilities sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_mine&orientation=landscape`,
    alt: 'Mining Colony',
  },
  research_colony: {
    url: `${BASE}?query=futuristic research colony frozen ice planet laboratory domes scientific equipment telescopes sensors sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_research&orientation=landscape`,
    alt: 'Research Colony',
  },
  military_base: {
    url: `${BASE}?query=futuristic military base fortified colony gun turrets defense towers armored bunkers fleet docking facilities sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_military&orientation=landscape`,
    alt: 'Military Base',
  },
  moon_base: {
    url: `${BASE}?query=futuristic moon base crater surface domes tunnels lunar colony grey barren landscape earth view sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_moon&orientation=landscape`,
    alt: 'Moon Base',
  },
  space_station: {
    url: `${BASE}?query=futuristic space station orbital platform ring modules solar arrays docking ports planet below sci-fi game art ogame style highly detailed illustration&width=600&height=360&seq=colony_station&orientation=landscape`,
    alt: 'Space Station',
  },
};

// ── Expanded PLANET_ART ───────────────────────────────────────────────────
// (already defined above, adding additional variants)
export const PLANET_ART_EXTRA: Record<string, ArtworkEntry> = {
  toxic: {
    url: `${BASE}?query=futuristic toxic planet green yellow acid clouds corrosive atmosphere space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_toxic&orientation=landscape`,
    alt: 'Toxic Planet',
  },
  crystal: {
    url: `${BASE}?query=futuristic crystal planet surface covered giant crystal formations glowing refraction space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_crystal&orientation=landscape`,
    alt: 'Crystal Planet',
  },
  iron: {
    url: `${BASE}?query=futuristic iron planet reddish brown metallic surface massive iron deposits space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_iron&orientation=landscape`,
    alt: 'Iron Planet',
  },
  storm: {
    url: `${BASE}?query=futuristic storm planet massive electrical storms dark clouds lightning perpetual tempest space view sci-fi game art ogame style detailed illustration&width=400&height=300&seq=planet_storm&orientation=landscape`,
    alt: 'Storm Planet',
  },
};

// ── Helper: get officer art ───────────────────────────────────────────────
export function getOfficerArt(role: string): ArtworkEntry {
  const key = role.toLowerCase().replace(/\s+/g, '_');
  if (OFFICER_ART[key]) return OFFICER_ART[key];
  if (key.includes('admiral') || key.includes('general')) return OFFICER_ART.admiral;
  if (key.includes('engineer') || key.includes('mechanic')) return OFFICER_ART.engineer;
  if (key.includes('scientist') || key.includes('research')) return OFFICER_ART.scientist;
  if (key.includes('spy') || key.includes('intel')) return OFFICER_ART.spy_master;
  if (key.includes('diplomat') || key.includes('ambassador')) return OFFICER_ART.diplomat;
  if (key.includes('geologist') || key.includes('miner')) return OFFICER_ART.geologist;
  if (key.includes('captain') || key.includes('pilot')) return OFFICER_ART.fleet_captain;
  return OFFICER_ART.commander;
}

export function getMegastructureArt(id: string): ArtworkEntry {
  const key = id.toLowerCase().replace(/\s+/g, '_');
  if (MEGASTRUCTURE_ART[key]) return MEGASTRUCTURE_ART[key];
  if (key.includes('dyson')) return MEGASTRUCTURE_ART.dyson_sphere;
  if (key.includes('ring')) return MEGASTRUCTURE_ART.ringworld;
  if (key.includes('gate') || key.includes('warp')) return MEGASTRUCTURE_ART.warp_gate;
  if (key.includes('elevator')) return MEGASTRUCTURE_ART.space_elevator;
  if (key.includes('forge')) return MEGASTRUCTURE_ART.stellar_forge;
  if (key.includes('relay') || key.includes('quantum')) return MEGASTRUCTURE_ART.quantum_relay;
  return MEGASTRUCTURE_ART.orbital_platform;
}

export function getStarbaseArt(type: string): ArtworkEntry {
  const key = type.toLowerCase().replace(/\s+/g, '_');
  if (STARBASE_ART[key]) return STARBASE_ART[key];
  if (key.includes('fortress') || key.includes('military')) return STARBASE_ART.fortress;
  if (key.includes('trade') || key.includes('hub')) return STARBASE_ART.trading_hub;
  if (key.includes('research') || key.includes('science')) return STARBASE_ART.research_station;
  if (key.includes('command') || key.includes('flag')) return STARBASE_ART.command_center;
  return STARBASE_ART.outpost;
}

export function getHeroArt(page: string): ArtworkEntry {
  const key = page.toLowerCase().replace(/[\s-]+/g, '_');
  return HERO_ART[key] ?? HERO_ART.universe;
}

export function getColonyArt(name: string, type?: string): ArtworkEntry {
  const k = (name + ' ' + (type || '')).toLowerCase();
  if (k.includes('home') || k.includes('alpha')) return COLONY_ART.homeworld;
  if (k.includes('mine') || k.includes('mining') || k.includes('desert')) return COLONY_ART.mining_colony;
  if (k.includes('research') || k.includes('science') || k.includes('gamma')) return COLONY_ART.research_colony;
  if (k.includes('military') || k.includes('fortress') || k.includes('base')) return COLONY_ART.military_base;
  if (k.includes('moon')) return COLONY_ART.moon_base;
  if (k.includes('station') || k.includes('orbital')) return COLONY_ART.space_station;
  return COLONY_ART.homeworld;
}