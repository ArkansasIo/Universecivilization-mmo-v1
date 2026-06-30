import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type RaceId = 'terran' | 'zenthari' | 'draken' | 'korvax' | 'golrath' | 'nexar' | 'aquarian' | 'velhari' | 'skarran';

interface EmpireData {
  empireName: string;
  commanderName: string;
  homeworld: string;
  race: RaceId;
  startingBonus: 'resources' | 'military' | 'research' | 'economy';
}

export default function EmpireCreationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [empireData, setEmpireData] = useState<EmpireData>({
    empireName: '',
    commanderName: '',
    homeworld: '',
    race: 'terran',
    startingBonus: 'resources'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const races = [
    { id: 'terran' as RaceId, name: 'Terran Dominion', category: 'Humanoid', description: 'Adaptable humans who built a galactic federation through diplomacy and balanced expansion.', bonus: '+10% Alliance benefits, +5% Trade efficiency, +1 Diplomat slot', color: 'from-amber-400 to-yellow-500', icon: 'ri-government-line', homeworldType: 'Terran (Temperate)', specialTrait: 'Extra diplomatic envoy & +5% relation gain with all NPC factions' },
    { id: 'zenthari' as RaceId, name: 'Zenthari Enclave', category: 'Psionic', description: 'Ancient crystalline psionics wielding telekinetic power and millennia of cosmic wisdom.', bonus: '+15% Research speed, +10% Energy production, Psionic defense bonus', color: 'from-fuchsia-500 to-pink-500', icon: 'ri-psychotherapy-line', homeworldType: 'Crystalline (Exotic)', specialTrait: 'Start with Crystal Archive Lv1 (+5% research speed permanently)' },
    { id: 'draken' as RaceId, name: 'Draken Clans', category: 'Reptilian', description: 'Honor-bound draconic warriors from volcanic worlds, masters of close-quarters combat.', bonus: '+15% Fleet attack power, +10% Ship build speed, Fire-resistant hulls', color: 'from-red-500 to-orange-500', icon: 'ri-sword-line', homeworldType: 'Volcanic (Hostile)', specialTrait: 'Start with 2 Clan Fighters & +10% damage vs Pirate factions' },
    { id: 'korvax' as RaceId, name: 'Korvax Scholar Caste', category: 'Mammalian', description: 'Hyper-intelligent researchers with photographic memory who maintain the Galactic Library.', bonus: '+20% Research speed, Start with Energy Tech Lv2, +1 Research slot', color: 'from-emerald-500 to-green-500', icon: 'ri-flask-line', homeworldType: 'Terran (Temperate)', specialTrait: 'Start with Energy Tech Lv2 & Computer Tech Lv1 researched' },
    { id: 'golrath' as RaceId, name: 'Golrath Merchant Guild', category: 'Mammalian (Canine)', description: 'Pack-descended merchants who control the galaxy\'s largest banking and trade networks.', bonus: '+25% Trade income, +15% Storage capacity, Reduced market fees', color: 'from-amber-600 to-orange-600', icon: 'ri-exchange-dollar-line', homeworldType: 'Terran (Temperate)', specialTrait: 'Start with +10,000 Imperial Credits & -15% marketplace tax rate' },
    { id: 'nexar' as RaceId, name: 'Nexar Machine Collective', category: 'Mechanical (AI)', description: 'Self-aware machine network that achieved consciousness and now optimizes the galaxy.', bonus: '+15% Building speed, +15% Energy efficiency, No food required', color: 'from-slate-400 to-zinc-500', icon: 'ri-cpu-line', homeworldType: 'Artificial (Station)', specialTrait: 'No food/water consumption, +10% construction speed on all buildings' },
    { id: 'aquarian' as RaceId, name: 'Aquarian Deep Council', category: 'Aquatic', description: 'Ancient oceanic beings who terraform worlds and offer unmatched ecological expertise.', bonus: '+20% Terraforming speed, +10% Food production, Water world affinity', color: 'from-teal-400 to-cyan-500', icon: 'ri-drop-line', homeworldType: 'Ocean (Water)', specialTrait: 'Start with +20% planet habitability on all world types' },
    { id: 'velhari' as RaceId, name: 'Velhari Nomad Fleet', category: 'Exotic (Void-Dweller)', description: 'Space-borne civilization of generation ships, master scavengers and star charters.', bonus: '+15% Fleet speed, +10% Expedition rewards, Free scout ship', color: 'from-rose-600 to-red-600', icon: 'ri-rocket-line', homeworldType: 'Void (Deep Space)', specialTrait: 'Start with 1 Scout Ship & +15% expedition success rate' },
    { id: 'skarran' as RaceId, name: 'Skarran Hive Collective', category: 'Insectoid (Hive)', description: 'Massive insectoid hive mind spanning hundreds of systems with unmatched production.', bonus: '+20% Building speed, +15% Population growth, Reduced unit cost', color: 'from-lime-500 to-green-600', icon: 'ri-bug-line', homeworldType: 'Jungle (Hostile)', specialTrait: 'Population grows 15% faster, -10% unit training cost' },
  ];

  const startingBonuses = [
    {
      id: 'resources',
      name: 'Resource Cache',
      description: 'Start with extra resources',
      bonus: '+1000 Metal, +750 Crystal, +500 Deuterium',
      icon: 'ri-database-2-line'
    },
    {
      id: 'military',
      name: 'Military Fleet',
      description: 'Begin with a small defensive fleet',
      bonus: '5 Light Fighters, 2 Heavy Fighters, 1 Cruiser',
      icon: 'ri-rocket-line'
    },
    {
      id: 'research',
      name: 'Research Head Start',
      description: 'Advanced technology from the beginning',
      bonus: 'Energy Tech Lv2, Computer Tech Lv2, Weapons Tech Lv1',
      icon: 'ri-flask-line'
    },
    {
      id: 'economy',
      name: 'Economic Boost',
      description: 'Enhanced production facilities',
      bonus: 'Metal Mine Lv3, Crystal Mine Lv2, Solar Plant Lv3',
      icon: 'ri-line-chart-line'
    }
  ];

  const handleCreateEmpire = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    setLoading(true);

    try {
      // Update profile (faction maps to race column)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: empireData.commanderName,
          avatar_url: `https://readdy.ai/api/search-image?query=futuristic%20space%20commander%20portrait%20wearing%20advanced%20tactical%20armor%20with%20glowing%20visor%20against%20starfield%20background%20digital%20art%20sci-fi%20character%20design%20high%20detail%20military%20officer%20$%7BempireData.race%7D%20faction&width=240&height=240&seq=avatar${Date.now()}&orientation=squarish`,
          level: 1,
          experience: 0,
          race: empireData.race,
        });

      if (profileError) throw profileError;

      // Determine starting resources based on race and bonus
      let metal = 500;
      let crystal = 300;
      let deuterium = 100;

      if (empireData.startingBonus === 'resources') {
        metal += 1000;
        crystal += 750;
        deuterium += 500;
      }

      // Race-specific resource modifiers
      if (empireData.race === 'zenthari') { metal -= 100; crystal += 100; deuterium += 100; }
      if (empireData.race === 'draken') { metal += 100; }
      if (empireData.race === 'korvax') { metal -= 100; crystal += 50; deuterium += 50; }
      if (empireData.race === 'golrath') { metal += 250; crystal += 200; deuterium += 150; }
      if (empireData.race === 'nexar') { metal += 50; crystal += 150; deuterium -= 100; }
      if (empireData.race === 'aquarian') { metal -= 100; deuterium += 200; }
      if (empireData.race === 'velhari') { metal -= 50; crystal += 50; deuterium += 100; }
      if (empireData.race === 'skarran') { metal += 100; crystal += 100; }

      // Update or create homeworld planet
      const { data: existingPlanets } = await supabase
        .from('planets')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      let planetData;

      if (existingPlanets && existingPlanets.length > 0) {
        // Update existing planet with empire name
        const { data: updatedPlanet, error: planetError } = await supabase
          .from('planets')
          .update({
            name: empireData.homeworld,
            is_capital: true,
            is_homeworld: true,
          })
          .eq('id', existingPlanets[0].id)
          .select()
          .single();

        if (planetError) throw planetError;
        planetData = updatedPlanet;
      } else {
        // Insert new planet with all required columns
        const { data: newPlanet, error: planetError } = await supabase
          .from('planets')
          .insert({
            user_id: user.id,
            player_id: user.id,
            name: empireData.homeworld,
            planet_type: 'terran',
            status: 'active',
            coordinates: '1:1:1',
            position_galaxy: 1,
            position_system: 1,
            position_planet: 1,
            temperature: 20,
            diameter: 12800,
            fields_used: 0,
            fields_max: 163,
            population: 0,
            development: 1,
            defense_level: 0,
            is_capital: true,
            is_homeworld: true,
            metal_storage: 10000,
            crystal_storage: 10000,
            deuterium_storage: 10000,
          })
          .select()
          .single();

        if (planetError) throw planetError;
        planetData = newPlanet;
      }

      // Update player resources (AuthContext already created the row)
      const { data: existingResources } = await supabase
        .from('player_resources')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingResources && existingResources.length > 0) {
        const { error: resourceError } = await supabase
          .from('player_resources')
          .update({
            metal,
            crystal,
            deuterium,
            energy: 0,
            dark_matter: 0,
          })
          .eq('id', existingResources[0].id);

        if (resourceError) throw resourceError;
      } else {
        const { error: resourceError } = await supabase
          .from('player_resources')
          .insert({
            user_id: user.id,
            player_id: user.id,
            metal,
            crystal,
            deuterium,
            energy: 0,
            dark_matter: 0,
            imperial_credits: 10000,
            republic_credits: 5000,
            antimatter: 0,
            nanites: 0,
          });

        if (resourceError) throw resourceError;
      }

      // Add starting research if research bonus selected
      if (empireData.startingBonus === 'research') {
        await supabase.from('research').insert([
          { user_id: user.id, player_id: user.id, technology_id: 'energy', technology_name: 'Energy Technology', level: 2 },
          { user_id: user.id, player_id: user.id, technology_id: 'computer', technology_name: 'Computer Technology', level: 2 },
          { user_id: user.id, player_id: user.id, technology_id: 'weapons', technology_name: 'Weapons Technology', level: 1 },
        ]);
      }

      // Add starting fleet if military bonus selected
      if (empireData.startingBonus === 'military') {
        // Create a stationed defense fleet with correct columns
        const { error: fleetError } = await supabase
          .from('fleets')
          .insert({
            user_id: user.id,
            player_id: user.id,
            name: 'Defense Fleet',
            mission: 'defense',
            status: 'stationed',
            origin_planet_id: planetData?.id ?? null,
            ships: JSON.stringify([
              { type: 'light_fighter', quantity: 5 },
              { type: 'heavy_fighter', quantity: 2 },
              { type: 'cruiser', quantity: 1 },
            ]),
            cargo_metal: 0,
            cargo_crystal: 0,
            cargo_deuterium: 0,
            total_ships: 8,
          })
          .select()
          .single();

        if (fleetError) throw fleetError;

        // Insert ships into the ships table (fleet_ships doesn't exist)
        await supabase.from('ships').insert([
          {
            user_id: user.id,
            planet_id: planetData?.id ?? null,
            ship_type: 'light_fighter',
            ship_name: 'Light Fighter',
            quantity: 5,
            level: 1,
            health: 100,
            attack_power: 50,
            defense_power: 10,
            speed: 100,
            cargo_capacity: 50,
            status: 'active',
          },
          {
            user_id: user.id,
            planet_id: planetData?.id ?? null,
            ship_type: 'heavy_fighter',
            ship_name: 'Heavy Fighter',
            quantity: 2,
            level: 1,
            health: 200,
            attack_power: 100,
            defense_power: 30,
            speed: 80,
            cargo_capacity: 75,
            status: 'active',
          },
          {
            user_id: user.id,
            planet_id: planetData?.id ?? null,
            ship_type: 'cruiser',
            ship_name: 'Cruiser',
            quantity: 1,
            level: 1,
            health: 500,
            attack_power: 200,
            defense_power: 80,
            speed: 60,
            cargo_capacity: 200,
            status: 'active',
          },
        ]);
      }

      // Upgrade buildings for economy bonus
      if (empireData.startingBonus === 'economy' && planetData?.id) {
        const { data: existingBuildings } = await supabase
          .from('buildings')
          .select('id, building_type')
          .eq('planet_id', planetData.id)
          .in('building_type', ['metal_mine', 'crystal_mine', 'solar_plant']);

        const buildingUpdates = [];
        const levelMap: Record<string, number> = { metal_mine: 3, crystal_mine: 2, solar_plant: 3 };

        if (existingBuildings && existingBuildings.length > 0) {
          for (const b of existingBuildings) {
            if (levelMap[b.building_type]) {
              buildingUpdates.push(
                supabase
                  .from('buildings')
                  .update({ level: levelMap[b.building_type] })
                  .eq('id', b.id)
              );
            }
          }
        }

        if (buildingUpdates.length > 0) {
          await Promise.all(buildingUpdates);
        }
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating empire:', error);
      alert(`Failed to create empire: ${error.message || 'Database error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Name Your Empire
        </h2>
        <p className="text-gray-400 text-lg">Choose a name that will echo through the galaxy</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Empire Name</label>
          <input
            type="text"
            value={empireData.empireName}
            onChange={(e) => setEmpireData({ ...empireData, empireName: e.target.value })}
            placeholder="The Eternal Empire"
            className="w-full px-6 py-4 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg"
            maxLength={30}
          />
          <p className="text-xs text-slate-500 mt-2">{empireData.empireName.length}/30 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Commander Name</label>
          <input
            type="text"
            value={empireData.commanderName}
            onChange={(e) => setEmpireData({ ...empireData, commanderName: e.target.value })}
            placeholder="Admiral Nexus"
            className="w-full px-6 py-4 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg"
            maxLength={20}
          />
          <p className="text-xs text-slate-500 mt-2">{empireData.commanderName.length}/20 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Homeworld Name</label>
          <input
            type="text"
            value={empireData.homeworld}
            onChange={(e) => setEmpireData({ ...empireData, homeworld: e.target.value })}
            placeholder="Terra Prime"
            className="w-full px-6 py-4 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg"
            maxLength={20}
          />
          <p className="text-xs text-slate-500 mt-2">{empireData.homeworld.length}/20 characters</p>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!empireData.empireName || !empireData.commanderName || !empireData.homeworld}
        className="w-full py-4 bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] font-bold rounded-xl hover:from-amber-400 hover:to-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
      >
        <span>Continue to Race Selection</span>
        <i className="ri-arrow-right-line text-2xl"></i>
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Choose Your Race
        </h2>
        <p className="text-gray-400 text-lg">Your species shapes your destiny across the galaxy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <div
            key={race.id}
            onClick={() => setEmpireData({ ...empireData, race: race.id })}
            className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
              empireData.race === race.id
                ? 'border-amber-400 bg-slate-800/80 shadow-lg shadow-amber-400/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            {empireData.race === race.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-black text-xl"></i>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${race.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <i className={`${race.icon} text-xl text-white`}></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{race.name}</h3>
                <span className="text-xs text-slate-500">{race.category}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-3 leading-relaxed">{race.description}</p>
            
            <div className="bg-slate-900/50 rounded-lg p-3 mb-2">
              <p className="text-xs text-amber-400 font-semibold">Racial Bonus:</p>
              <p className="text-xs text-gray-300 mt-1">{race.bonus}</p>
            </div>
            <p className="text-xs text-slate-500">{race.specialTrait}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-4 bg-slate-800/50 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
        >
          <i className="ri-arrow-left-line text-2xl"></i>
          <span>Back</span>
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
        >
          <span>Continue to Starting Bonus</span>
          <i className="ri-arrow-right-line text-2xl"></i>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Select Starting Bonus
        </h2>
        <p className="text-gray-400 text-lg">Choose your initial advantage to kickstart your empire</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {startingBonuses.map((bonus) => (
          <div
            key={bonus.id}
            onClick={() => setEmpireData({ ...empireData, startingBonus: bonus.id as any })}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
              empireData.startingBonus === bonus.id
                ? 'border-cyan-400 bg-slate-800/80 shadow-lg shadow-cyan-400/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            {empireData.startingBonus === bonus.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-black text-xl"></i>
              </div>
            )}
            
            <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mb-4">
              <i className={`${bonus.icon} text-3xl text-cyan-400`}></i>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{bonus.name}</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">{bonus.description}</p>
            
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-sm text-cyan-400 font-semibold">You Receive:</p>
              <p className="text-sm text-gray-300">{bonus.bonus}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-4 bg-slate-800/50 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
        >
          <i className="ri-arrow-left-line text-2xl"></i>
          <span>Back</span>
        </button>
        <button
          onClick={() => setStep(4)}
          className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
        >
          <span>Review Empire</span>
          <i className="ri-arrow-right-line text-2xl"></i>
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedRace = races.find(r => r.id === empireData.race);
    const selectedBonus = startingBonuses.find(b => b.id === empireData.startingBonus);

    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Confirm Your Empire
          </h2>
          <p className="text-gray-400 text-lg">Review your choices before launching into the galaxy</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">Empire Name</p>
              <p className="text-2xl font-bold text-white">{empireData.empireName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Commander</p>
              <p className="text-2xl font-bold text-white">{empireData.commanderName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Homeworld</p>
              <p className="text-2xl font-bold text-white">{empireData.homeworld}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Race</p>
              <p className="text-2xl font-bold text-white">{selectedRace?.name}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400 mb-3">Racial Bonus — {selectedRace?.name}</p>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-amber-400 font-semibold">{selectedRace?.bonus}</p>
              <p className="text-xs text-slate-500 mt-2">{selectedRace?.specialTrait}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400 mb-3">Starting Bonus: {selectedBonus?.name}</p>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-semibold">{selectedBonus?.bonus}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStep(3)}
            className="flex-1 py-4 bg-slate-800/50 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line text-2xl"></i>
            <span>Back</span>
          </button>
          <button
            onClick={handleCreateEmpire}
            disabled={loading}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-2xl"></i>
                <span>Creating Empire...</span>
              </>
            ) : (
              <>
                <i className="ri-rocket-2-line text-2xl"></i>
                <span>Launch Empire</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-5xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                      : 'bg-slate-800/50 text-slate-500 border border-slate-700'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`w-16 h-1 mx-2 transition-all ${
                      step > s ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-6">
              <span className={`text-sm ${step >= 1 ? 'text-cyan-400' : 'text-slate-500'}`}>Empire Info</span>
              <span className={`text-sm ${step >= 2 ? 'text-cyan-400' : 'text-slate-500'}`}>Race</span>
              <span className={`text-sm ${step >= 3 ? 'text-cyan-400' : 'text-slate-500'}`}>Bonus</span>
              <span className={`text-sm ${step >= 4 ? 'text-cyan-400' : 'text-slate-500'}`}>Confirm</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-cyan-400/20 p-8 md:p-12">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>
        </div>
      </div>
    </div>
  );
}
