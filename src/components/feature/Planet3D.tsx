import { useState } from 'react';

export type PlanetType =
  | 'terrestrial' | 'ocean' | 'desert' | 'ice' | 'volcanic' | 'gas_giant'
  | 'ice_giant' | 'lava' | 'toxic' | 'crystal' | 'jungle' | 'barren'
  | 'arctic' | 'savanna' | 'tundra' | 'continental' | 'arid';

export type StarType =
  | 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M'
  | 'neutron' | 'pulsar' | 'white_dwarf' | 'red_giant' | 'blue_giant' | 'black_hole';

export type MoonType = 'rocky' | 'icy' | 'volcanic' | 'barren' | 'metallic';

// ── Planet config ──────────────────────────────────────────────────────────
const PLANET_CONFIG: Record<PlanetType, {
  gradient: string[];
  atmosphere: string;
  rings?: boolean;
  cloudColor?: string;
  imageSeq: number;
  imagePrompt: string;
}> = {
  terrestrial: {
    gradient: ['#2d6a4f', '#40916c', '#74c69d', '#1e3a5f'],
    atmosphere: 'rgba(100,180,255,0.25)',
    cloudColor: 'rgba(255,255,255,0.6)',
    imageSeq: 1001,
    imagePrompt: 'photorealistic terrestrial planet from space green continents blue oceans white clouds atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  ocean: {
    gradient: ['#023e8a', '#0077b6', '#00b4d8', '#90e0ef'],
    atmosphere: 'rgba(80,160,255,0.3)',
    cloudColor: 'rgba(255,255,255,0.5)',
    imageSeq: 1002,
    imagePrompt: 'photorealistic ocean world planet from space deep blue water surface white storm clouds atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  desert: {
    gradient: ['#7f4f24', '#b5832a', '#e9c46a', '#f4a261'],
    atmosphere: 'rgba(255,180,80,0.2)',
    imageSeq: 1003,
    imagePrompt: 'photorealistic desert planet from space orange sandy surface dunes craters atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  ice: {
    gradient: ['#caf0f8', '#90e0ef', '#48cae4', '#0096c7'],
    atmosphere: 'rgba(180,230,255,0.3)',
    cloudColor: 'rgba(255,255,255,0.7)',
    imageSeq: 1004,
    imagePrompt: 'photorealistic ice world planet from space white frozen surface glaciers blue tones atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  volcanic: {
    gradient: ['#370617', '#6a040f', '#d00000', '#f48c06'],
    atmosphere: 'rgba(255,80,20,0.3)',
    imageSeq: 1005,
    imagePrompt: 'photorealistic volcanic planet from space red lava flows dark rock surface glowing magma atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  gas_giant: {
    gradient: ['#e76f51', '#f4a261', '#e9c46a', '#264653'],
    atmosphere: 'rgba(255,160,80,0.2)',
    rings: true,
    imageSeq: 1006,
    imagePrompt: 'photorealistic gas giant planet from space orange brown banded atmosphere storm systems rings sci-fi stellaris style highly detailed 3d render',
  },
  ice_giant: {
    gradient: ['#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7'],
    atmosphere: 'rgba(100,200,255,0.25)',
    rings: true,
    imageSeq: 1007,
    imagePrompt: 'photorealistic ice giant planet from space blue teal atmosphere rings sci-fi stellaris style highly detailed 3d render',
  },
  lava: {
    gradient: ['#240046', '#7b2d8b', '#ff4800', '#ff9500'],
    atmosphere: 'rgba(255,60,0,0.35)',
    imageSeq: 1008,
    imagePrompt: 'photorealistic lava planet from space glowing orange red surface rivers of lava dark crust atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  toxic: {
    gradient: ['#2d6a4f', '#52b788', '#b7e4c7', '#74c69d'],
    atmosphere: 'rgba(120,255,80,0.3)',
    cloudColor: 'rgba(180,255,100,0.5)',
    imageSeq: 1009,
    imagePrompt: 'photorealistic toxic planet from space green yellow poisonous atmosphere thick clouds acid rain sci-fi stellaris style highly detailed 3d render',
  },
  crystal: {
    gradient: ['#f72585', '#b5179e', '#7209b7', '#560bad'],
    atmosphere: 'rgba(200,100,255,0.3)',
    imageSeq: 1010,
    imagePrompt: 'photorealistic crystal planet from space pink purple crystalline surface glittering formations atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  jungle: {
    gradient: ['#1b4332', '#2d6a4f', '#40916c', '#52b788'],
    atmosphere: 'rgba(80,200,100,0.25)',
    cloudColor: 'rgba(255,255,255,0.5)',
    imageSeq: 1011,
    imagePrompt: 'photorealistic jungle planet from space dense green vegetation canopy tropical atmosphere white clouds sci-fi stellaris style highly detailed 3d render',
  },
  barren: {
    gradient: ['#495057', '#6c757d', '#adb5bd', '#dee2e6'],
    atmosphere: 'rgba(150,150,150,0.1)',
    imageSeq: 1012,
    imagePrompt: 'photorealistic barren rocky planet from space grey cratered surface no atmosphere moon-like sci-fi stellaris style highly detailed 3d render',
  },
  arctic: {
    gradient: ['#e0fbfc', '#98c1d9', '#3d5a80', '#293241'],
    atmosphere: 'rgba(200,240,255,0.25)',
    cloudColor: 'rgba(255,255,255,0.8)',
    imageSeq: 1013,
    imagePrompt: 'photorealistic arctic tundra planet from space white ice caps frozen surface blue atmosphere sci-fi stellaris style highly detailed 3d render',
  },
  savanna: {
    gradient: ['#e9c46a', '#f4a261', '#e76f51', '#264653'],
    atmosphere: 'rgba(255,200,100,0.2)',
    imageSeq: 1014,
    imagePrompt: 'photorealistic savanna planet from space golden grasslands dry terrain scattered vegetation atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  tundra: {
    gradient: ['#606c38', '#283618', '#dda15e', '#bc6c25'],
    atmosphere: 'rgba(150,200,150,0.2)',
    imageSeq: 1015,
    imagePrompt: 'photorealistic tundra planet from space mixed terrain snow patches brown green surface atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  continental: {
    gradient: ['#1d3557', '#457b9d', '#a8dadc', '#f1faee'],
    atmosphere: 'rgba(100,180,255,0.25)',
    cloudColor: 'rgba(255,255,255,0.6)',
    imageSeq: 1016,
    imagePrompt: 'photorealistic continental planet from space multiple continents oceans varied terrain atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
  arid: {
    gradient: ['#9b2226', '#ae2012', '#bb3e03', '#ca6702'],
    atmosphere: 'rgba(200,120,50,0.2)',
    imageSeq: 1017,
    imagePrompt: 'photorealistic arid dry planet from space red brown cracked surface minimal water atmosphere glow sci-fi stellaris style highly detailed 3d render',
  },
};

// ── Star config ────────────────────────────────────────────────────────────
const STAR_CONFIG: Record<StarType, {
  colors: string[];
  glowColor: string;
  size: number;
  imageSeq: number;
  imagePrompt: string;
}> = {
  G: {
    colors: ['#fff7d6', '#ffe066', '#ffd000'],
    glowColor: 'rgba(255,220,80,0.6)',
    size: 1,
    imageSeq: 2001,
    imagePrompt: 'photorealistic yellow G-type main sequence star from space solar corona flares prominences deep space background sci-fi stellaris style highly detailed 3d render',
  },
  K: {
    colors: ['#ffb347', '#ff8c00', '#ff6600'],
    glowColor: 'rgba(255,140,0,0.6)',
    size: 0.9,
    imageSeq: 2002,
    imagePrompt: 'photorealistic orange K-type star from space warm orange glow solar corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  M: {
    colors: ['#ff4444', '#cc2200', '#ff6666'],
    glowColor: 'rgba(255,60,60,0.6)',
    size: 0.7,
    imageSeq: 2003,
    imagePrompt: 'photorealistic red dwarf M-type star from space dim red glow solar flares deep space background sci-fi stellaris style highly detailed 3d render',
  },
  F: {
    colors: ['#fffde7', '#fff9c4', '#fff176'],
    glowColor: 'rgba(255,255,200,0.6)',
    size: 1.1,
    imageSeq: 2004,
    imagePrompt: 'photorealistic yellow-white F-type star from space bright corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  A: {
    colors: ['#e8f4fd', '#bbdefb', '#90caf9'],
    glowColor: 'rgba(180,220,255,0.6)',
    size: 1.2,
    imageSeq: 2005,
    imagePrompt: 'photorealistic white A-type star from space bright white blue glow corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  B: {
    colors: ['#90caf9', '#42a5f5', '#1e88e5'],
    glowColor: 'rgba(100,180,255,0.7)',
    size: 1.4,
    imageSeq: 2006,
    imagePrompt: 'photorealistic blue-white B-type star from space intense blue glow corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  O: {
    colors: ['#4fc3f7', '#0288d1', '#01579b'],
    glowColor: 'rgba(50,150,255,0.8)',
    size: 1.6,
    imageSeq: 2007,
    imagePrompt: 'photorealistic blue O-type supergiant star from space intense blue ultraviolet glow corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  red_giant: {
    colors: ['#ff6b35', '#ff4500', '#cc2200'],
    glowColor: 'rgba(255,80,30,0.7)',
    size: 2.0,
    imageSeq: 2008,
    imagePrompt: 'photorealistic red giant star from space enormous red orange glowing sphere solar corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  blue_giant: {
    colors: ['#00b4d8', '#0077b6', '#023e8a'],
    glowColor: 'rgba(0,180,220,0.7)',
    size: 1.8,
    imageSeq: 2009,
    imagePrompt: 'photorealistic blue giant star from space intense blue glow massive corona deep space background sci-fi stellaris style highly detailed 3d render',
  },
  white_dwarf: {
    colors: ['#f8f9fa', '#e9ecef', '#dee2e6'],
    glowColor: 'rgba(240,240,255,0.5)',
    size: 0.4,
    imageSeq: 2010,
    imagePrompt: 'photorealistic white dwarf star from space tiny intensely bright white star deep space background sci-fi stellaris style highly detailed 3d render',
  },
  neutron: {
    colors: ['#adb5bd', '#6c757d', '#495057'],
    glowColor: 'rgba(180,200,220,0.5)',
    size: 0.3,
    imageSeq: 2011,
    imagePrompt: 'photorealistic neutron star from space tiny dense star with magnetic field lines deep space background sci-fi stellaris style highly detailed 3d render',
  },
  pulsar: {
    colors: ['#00f5d4', '#00bbf9', '#9b5de5'],
    glowColor: 'rgba(0,245,212,0.7)',
    size: 0.35,
    imageSeq: 2012,
    imagePrompt: 'photorealistic pulsar star from space rotating neutron star with energy beams jets deep space background sci-fi stellaris style highly detailed 3d render',
  },
  black_hole: {
    colors: ['#000000', '#1a1a2e', '#16213e'],
    glowColor: 'rgba(255,140,0,0.8)',
    size: 1.0,
    imageSeq: 2013,
    imagePrompt: 'photorealistic black hole from space accretion disk glowing orange event horizon gravitational lensing deep space background sci-fi stellaris style highly detailed 3d render',
  },
};

// ── Planet3D Component ─────────────────────────────────────────────────────
interface Planet3DProps {
  type?: PlanetType;
  size?: number;
  label?: string;
  sublabel?: string;
  showRings?: boolean;
  animate?: boolean;
  onClick?: () => void;
  selected?: boolean;
  useImage?: boolean;
}

export function Planet3D({
  type = 'terrestrial',
  size = 80,
  label,
  sublabel,
  animate = true,
  onClick,
  selected = false,
  useImage = true,
}: Planet3DProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = PLANET_CONFIG[type] ?? PLANET_CONFIG.terrestrial;
  const hasRings = cfg.rings;

  const imageUrl = useImage
    ? `https://readdy.ai/api/search-image?query=${encodeURIComponent(cfg.imagePrompt)}&width=${size * 2}&height=${size * 2}&seq=${cfg.imageSeq}&orientation=squarish`
    : null;

  return (
    <div
      className={`flex flex-col items-center gap-2 cursor-pointer select-none ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex items-center justify-center" style={{ width: size + (hasRings ? size * 0.8 : 0), height: size + (hasRings ? size * 0.3 : 0) }}>
        {/* Rings (behind planet) */}
        {hasRings && (
          <div
            className="absolute"
            style={{
              width: size * 1.8,
              height: size * 0.35,
              borderRadius: '50%',
              border: `${size * 0.06}px solid`,
              borderColor: `${cfg.gradient[2]}80`,
              boxShadow: `0 0 ${size * 0.1}px ${cfg.gradient[1]}40`,
              transform: 'rotateX(70deg)',
              zIndex: 0,
            }}
          />
        )}

        {/* Planet sphere */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: size,
            height: size,
            zIndex: 1,
            boxShadow: selected
              ? `0 0 ${size * 0.4}px ${cfg.atmosphere}, 0 0 ${size * 0.15}px ${cfg.gradient[1]}, inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.6)`
              : hovered
              ? `0 0 ${size * 0.3}px ${cfg.atmosphere}, inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.6)`
              : `0 0 ${size * 0.15}px ${cfg.atmosphere}, inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.6)`,
            transition: 'box-shadow 0.3s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        >
          {/* Image or gradient */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label ?? type}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.2) contrast(1.05)' }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${cfg.gradient[2]}, ${cfg.gradient[0]} 60%, ${cfg.gradient[3] ?? cfg.gradient[0]})`,
              }}
            />
          )}

          {/* Atmosphere rim */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, transparent 55%, ${cfg.atmosphere} 80%, ${cfg.atmosphere} 100%)`,
            }}
          />

          {/* Shadow side */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 75% 65%, rgba(0,0,0,0.7) 30%, transparent 70%)',
            }}
          />

          {/* Clouds */}
          {cfg.cloudColor && animate && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(ellipse at 40% 30%, ${cfg.cloudColor} 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, ${cfg.cloudColor} 0%, transparent 35%)`,
                animation: 'spin 40s linear infinite',
              }}
            />
          )}

          {/* Selection ring */}
          {selected && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${cfg.gradient[2]}`,
                boxShadow: `inset 0 0 ${size * 0.1}px ${cfg.gradient[2]}80`,
              }}
            />
          )}
        </div>

        {/* Rings (in front) */}
        {hasRings && (
          <div
            className="absolute"
            style={{
              width: size * 1.8,
              height: size * 0.35,
              borderRadius: '50%',
              border: `${size * 0.04}px solid`,
              borderColor: `${cfg.gradient[1]}40`,
              transform: 'rotateX(70deg)',
              zIndex: 2,
            }}
          />
        )}
      </div>

      {label && (
        <div className="text-center">
          <p className="text-xs font-semibold text-white leading-tight">{label}</p>
          {sublabel && <p className="text-xs text-gray-400 leading-tight">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}

// ── Star3D Component ───────────────────────────────────────────────────────
interface Star3DProps {
  type?: StarType;
  size?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
  onClick?: () => void;
  selected?: boolean;
  useImage?: boolean;
}

export function Star3D({
  type = 'G',
  size = 100,
  label,
  sublabel,
  animate = true,
  onClick,
  selected = false,
  useImage = true,
}: Star3DProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = STAR_CONFIG[type] ?? STAR_CONFIG.G;
  const isBlackHole = type === 'black_hole';

  const imageUrl = useImage
    ? `https://readdy.ai/api/search-image?query=${encodeURIComponent(cfg.imagePrompt)}&width=${size * 2}&height=${size * 2}&seq=${cfg.imageSeq}&orientation=squarish`
    : null;

  const actualSize = size * cfg.size;

  return (
    <div
      className="flex flex-col items-center gap-2 select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="relative flex items-center justify-center" style={{ width: actualSize * 1.6, height: actualSize * 1.6 }}>
        {/* Outer glow */}
        {!isBlackHole && (
          <div
            className="absolute rounded-full"
            style={{
              width: actualSize * 1.5,
              height: actualSize * 1.5,
              background: `radial-gradient(circle, ${cfg.glowColor} 0%, transparent 70%)`,
              animation: animate ? 'pulse 3s ease-in-out infinite' : 'none',
            }}
          />
        )}

        {/* Black hole accretion disk */}
        {isBlackHole && (
          <div
            className="absolute rounded-full"
            style={{
              width: actualSize * 2.2,
              height: actualSize * 0.5,
              background: 'conic-gradient(from 0deg, #ff8c00, #ff4500, #ff0000, #ff8c00)',
              filter: 'blur(4px)',
              opacity: 0.8,
              animation: animate ? 'spin 4s linear infinite' : 'none',
            }}
          />
        )}

        {/* Star body */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: actualSize,
            height: actualSize,
            zIndex: 1,
            boxShadow: selected
              ? `0 0 ${actualSize * 0.8}px ${cfg.glowColor}, 0 0 ${actualSize * 0.3}px ${cfg.colors[0]}`
              : hovered
              ? `0 0 ${actualSize * 0.6}px ${cfg.glowColor}, 0 0 ${actualSize * 0.2}px ${cfg.colors[0]}`
              : `0 0 ${actualSize * 0.4}px ${cfg.glowColor}`,
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label ?? type}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.3) brightness(1.1)' }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: isBlackHole
                  ? 'radial-gradient(circle, #000 40%, #1a1a2e 70%, #000 100%)'
                  : `radial-gradient(circle at 40% 40%, ${cfg.colors[0]}, ${cfg.colors[1]} 50%, ${cfg.colors[2]})`,
              }}
            />
          )}

          {/* Corona effect */}
          {!isBlackHole && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
              }}
            />
          )}
        </div>

        {/* Solar flares */}
        {!isBlackHole && animate && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: actualSize * 0.15,
                height: actualSize * 0.4,
                background: `linear-gradient(to top, ${cfg.colors[0]}, transparent)`,
                top: '5%',
                left: '50%',
                transformOrigin: 'bottom center',
                animation: 'flare1 4s ease-in-out infinite',
                opacity: 0.6,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: actualSize * 0.12,
                height: actualSize * 0.3,
                background: `linear-gradient(to right, ${cfg.colors[0]}, transparent)`,
                top: '50%',
                right: '5%',
                transformOrigin: 'left center',
                animation: 'flare2 5s ease-in-out infinite',
                opacity: 0.5,
              }}
            />
          </>
        )}
      </div>

      {label && (
        <div className="text-center">
          <p className="text-xs font-semibold text-white leading-tight">{label}</p>
          {sublabel && <p className="text-xs text-gray-400 leading-tight">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}

// ── Moon3D Component ───────────────────────────────────────────────────────
interface Moon3DProps {
  type?: MoonType;
  size?: number;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
}

const MOON_CONFIG: Record<MoonType, { gradient: string[]; imageSeq: number; imagePrompt: string }> = {
  rocky: {
    gradient: ['#adb5bd', '#6c757d', '#495057'],
    imageSeq: 3001,
    imagePrompt: 'photorealistic rocky moon from space grey cratered surface like earths moon deep space background sci-fi stellaris style highly detailed 3d render',
  },
  icy: {
    gradient: ['#e0fbfc', '#98c1d9', '#3d5a80'],
    imageSeq: 3002,
    imagePrompt: 'photorealistic icy moon from space white blue frozen surface cracks deep space background sci-fi stellaris style highly detailed 3d render',
  },
  volcanic: {
    gradient: ['#370617', '#6a040f', '#f48c06'],
    imageSeq: 3003,
    imagePrompt: 'photorealistic volcanic moon from space dark surface lava flows glowing cracks deep space background sci-fi stellaris style highly detailed 3d render',
  },
  barren: {
    gradient: ['#343a40', '#495057', '#6c757d'],
    imageSeq: 3004,
    imagePrompt: 'photorealistic barren moon from space dark grey surface craters no atmosphere deep space background sci-fi stellaris style highly detailed 3d render',
  },
  metallic: {
    gradient: ['#b5838d', '#e5989b', '#ffb4a2'],
    imageSeq: 3005,
    imagePrompt: 'photorealistic metallic moon from space shiny metallic surface craters deep space background sci-fi stellaris style highly detailed 3d render',
  },
};

export function Moon3D({ type = 'rocky', size = 30, label, onClick, selected = false }: Moon3DProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = MOON_CONFIG[type] ?? MOON_CONFIG.rocky;
  const imageUrl = `https://readdy.ai/api/search-image?query=${encodeURIComponent(cfg.imagePrompt)}&width=${size * 3}&height=${size * 3}&seq=${cfg.imageSeq}&orientation=squarish`;

  return (
    <div
      className="flex flex-col items-center gap-1 select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          boxShadow: selected
            ? `0 0 ${size * 0.5}px rgba(200,220,255,0.6), inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.7)`
            : hovered
            ? `0 0 ${size * 0.3}px rgba(200,220,255,0.4), inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.7)`
            : `inset -${size * 0.15}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.7)`,
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <img
          src={imageUrl}
          alt={label ?? type}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.9) contrast(1.1)' }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 65%, rgba(0,0,0,0.6) 20%, transparent 65%)',
          }}
        />
      </div>
      {label && <p className="text-xs text-gray-400 text-center leading-tight">{label}</p>}
    </div>
  );
}

// ── Galaxy3D Component ─────────────────────────────────────────────────────
interface Galaxy3DProps {
  type?: 'spiral' | 'elliptical' | 'irregular' | 'barred-spiral' | 'lenticular';
  size?: number;
  name?: string;
  color?: string;
  onClick?: () => void;
  selected?: boolean;
  imageSeq?: number;
}

const GALAXY_PROMPTS: Record<string, { prompt: string; seq: number }> = {
  spiral: { prompt: 'photorealistic spiral galaxy from space blue white star arms nebula dust lanes deep space background sci-fi stellaris style highly detailed 3d render top down view', seq: 4001 },
  elliptical: { prompt: 'photorealistic elliptical galaxy from space golden yellow old stars smooth oval shape deep space background sci-fi stellaris style highly detailed 3d render', seq: 4002 },
  irregular: { prompt: 'photorealistic irregular galaxy from space chaotic star formation blue pink nebulae deep space background sci-fi stellaris style highly detailed 3d render', seq: 4003 },
  'barred-spiral': { prompt: 'photorealistic barred spiral galaxy from space central bar structure spiral arms blue white stars deep space background sci-fi stellaris style highly detailed 3d render top down view', seq: 4004 },
  lenticular: { prompt: 'photorealistic lenticular galaxy from space disc shape no spiral arms golden stars deep space background sci-fi stellaris style highly detailed 3d render', seq: 4005 },
};

export function Galaxy3D({ type = 'spiral', size = 120, name, onClick, selected = false, imageSeq }: Galaxy3DProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = GALAXY_PROMPTS[type] ?? GALAXY_PROMPTS.spiral;
  const seq = imageSeq ?? cfg.seq;
  const imageUrl = `https://readdy.ai/api/search-image?query=${encodeURIComponent(cfg.prompt)}&width=${size * 2}&height=${size * 2}&seq=${seq}&orientation=squarish`;

  return (
    <div
      className="flex flex-col items-center gap-2 select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          boxShadow: selected
            ? `0 0 ${size * 0.4}px rgba(150,100,255,0.7), 0 0 ${size * 0.15}px rgba(100,200,255,0.5)`
            : hovered
            ? `0 0 ${size * 0.25}px rgba(150,100,255,0.5)`
            : `0 0 ${size * 0.1}px rgba(100,80,200,0.3)`,
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <img
          src={imageUrl}
          alt={name ?? type}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(1.3) brightness(1.05)' }}
        />
        {selected && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(150,100,255,0.8)' }}
          />
        )}
      </div>
      {name && (
        <p className="text-xs font-semibold text-white text-center leading-tight">{name}</p>
      )}
    </div>
  );
}

// ── CSS keyframes injection ────────────────────────────────────────────────
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
  @keyframes flare1 { 0%,100% { transform:rotate(-10deg) scaleY(0.8); opacity:0.4; } 50% { transform:rotate(10deg) scaleY(1.2); opacity:0.7; } }
  @keyframes flare2 { 0%,100% { transform:rotate(5deg) scaleX(0.8); opacity:0.3; } 50% { transform:rotate(-5deg) scaleX(1.3); opacity:0.6; } }
`;
if (!document.head.querySelector('[data-planet3d-styles]')) {
  styleTag.setAttribute('data-planet3d-styles', '');
  document.head.appendChild(styleTag);
}
