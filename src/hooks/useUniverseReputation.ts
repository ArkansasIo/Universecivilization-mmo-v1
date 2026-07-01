import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Faction {
  id: string;
  name: string;
  universeId: string;
  description: string;
  type: 'military' | 'trade' | 'science' | 'pirate' | 'neutral' | 'ancient';
  homeGalaxy: string;
  color: string;
  icon: string;
  benefits: {
    level: number;
    title: string;
    perks: string[];
  }[];
}

export interface ReputationStanding {
  factionId: string;
  reputation: number; // -10000 to +10000
  level: number; // 1-10
  title: string;
  relationStatus: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'allied';
}

export interface ReputationMission {
  id: string;
  factionId: string;
  title: string;
  description: string;
  type: 'combat' | 'trade' | 'exploration' | 'diplomacy' | 'research';
  reputationReward: number;
  otherRewards: {
    credits?: number;
    resources?: any;
    items?: string[];
  };
  requirements: {
    minReputation?: number;
    minLevel?: number;
    completedMissions?: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  duration: number; // minutes
  available: boolean;
}

export const useUniverseReputation = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [reputations, setReputations] = useState<Map<string, ReputationStanding>>(new Map());
  const [missions, setMissions] = useState<ReputationMission[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize factions
  useEffect(() => {
    const initializeFactions = () => {
      const defaultFactions: Faction[] = [
        {
          id: 'faction-terran-federation',
          name: 'Terran Federation',
          universeId: 'universe-alpha',
          description: 'The united human government focused on expansion and military strength.',
          type: 'military',
          homeGalaxy: 'galaxy-2',
          color: '#3B82F6',
          icon: '🛡️',
          benefits: [
            {
              level: 1,
              title: 'Recruit',
              perks: ['Access to basic military ships', '5% discount on weapons']
            },
            {
              level: 3,
              title: 'Soldier',
              perks: ['Access to advanced military ships', '10% discount on weapons', 'Military missions available']
            },
            {
              level: 5,
              title: 'Officer',
              perks: ['Access to elite military ships', '15% discount on weapons', 'Special military contracts']
            },
            {
              level: 7,
              title: 'Commander',
              perks: ['Access to capital ships', '20% discount on weapons', 'Command fleet operations']
            },
            {
              level: 10,
              title: 'Admiral',
              perks: ['Access to all military technology', '25% discount on weapons', 'Lead faction wars']
            }
          ]
        },
        {
          id: 'faction-trade-consortium',
          name: 'Galactic Trade Consortium',
          universeId: 'universe-alpha',
          description: 'A powerful merchant alliance controlling major trade routes.',
          type: 'trade',
          homeGalaxy: 'galaxy-1',
          color: '#10B981',
          icon: '💰',
          benefits: [
            {
              level: 1,
              title: 'Trader',
              perks: ['Access to trade routes', '5% better trade prices']
            },
            {
              level: 3,
              title: 'Merchant',
              perks: ['Access to premium goods', '10% better trade prices', 'Exclusive trade missions']
            },
            {
              level: 5,
              title: 'Trade Baron',
              perks: ['Access to rare commodities', '15% better trade prices', 'Private trade contracts']
            },
            {
              level: 7,
              title: 'Trade Lord',
              perks: ['Access to exotic goods', '20% better trade prices', 'Control trade routes']
            },
            {
              level: 10,
              title: 'Trade Magnate',
              perks: ['Access to all markets', '25% better trade prices', 'Influence market prices']
            }
          ]
        },
        {
          id: 'faction-science-collective',
          name: 'Science Collective',
          universeId: 'universe-alpha',
          description: 'A coalition of researchers dedicated to advancing knowledge.',
          type: 'science',
          homeGalaxy: 'galaxy-3',
          color: '#8B5CF6',
          icon: '🔬',
          benefits: [
            {
              level: 1,
              title: 'Researcher',
              perks: ['Access to research facilities', '5% faster research']
            },
            {
              level: 3,
              title: 'Scientist',
              perks: ['Access to advanced labs', '10% faster research', 'Research missions available']
            },
            {
              level: 5,
              title: 'Lead Scientist',
              perks: ['Access to experimental tech', '15% faster research', 'Prototype testing']
            },
            {
              level: 7,
              title: 'Professor',
              perks: ['Access to cutting-edge tech', '20% faster research', 'Lead research projects']
            },
            {
              level: 10,
              title: 'Chief Scientist',
              perks: ['Access to all technologies', '25% faster research', 'Discover new technologies']
            }
          ]
        },
        {
          id: 'faction-void-pirates',
          name: 'Void Pirates',
          universeId: 'universe-beta',
          description: 'Ruthless space pirates controlling lawless sectors.',
          type: 'pirate',
          homeGalaxy: 'galaxy-6',
          color: '#EF4444',
          icon: '☠️',
          benefits: [
            {
              level: 1,
              title: 'Scavenger',
              perks: ['Access to black market', 'Raid weak targets']
            },
            {
              level: 3,
              title: 'Raider',
              perks: ['Access to stolen goods', 'Raid medium targets', 'Pirate missions']
            },
            {
              level: 5,
              title: 'Corsair',
              perks: ['Access to pirate ships', 'Raid strong targets', 'Lead pirate raids']
            },
            {
              level: 7,
              title: 'Pirate Captain',
              perks: ['Access to pirate fleet', 'Raid any target', 'Control pirate bases']
            },
            {
              level: 10,
              title: 'Pirate Lord',
              perks: ['Access to legendary ships', 'Lead pirate armada', 'Rule pirate territories']
            }
          ]
        },
        {
          id: 'faction-ancient-guardians',
          name: 'Ancient Guardians',
          universeId: 'universe-delta',
          description: 'Mysterious ancient beings protecting forgotten knowledge.',
          type: 'ancient',
          homeGalaxy: 'galaxy-4',
          color: '#F59E0B',
          icon: '🗿',
          benefits: [
            {
              level: 1,
              title: 'Seeker',
              perks: ['Access to ancient sites', 'Discover artifacts']
            },
            {
              level: 3,
              title: 'Explorer',
              perks: ['Access to ancient technology', 'Decipher ancient texts', 'Ancient missions']
            },
            {
              level: 5,
              title: 'Archaeologist',
              perks: ['Access to ancient weapons', 'Unlock ancient secrets', 'Restore ancient tech']
            },
            {
              level: 7,
              title: 'Keeper',
              perks: ['Access to ancient ships', 'Use ancient powers', 'Guard ancient knowledge']
            },
            {
              level: 10,
              title: 'Guardian',
              perks: ['Access to all ancient tech', 'Master ancient powers', 'Become immortal guardian']
            }
          ]
        },
        {
          id: 'faction-neutral-alliance',
          name: 'Neutral Alliance',
          universeId: 'universe-gamma',
          description: 'A peaceful coalition maintaining balance and diplomacy.',
          type: 'neutral',
          homeGalaxy: 'galaxy-5',
          color: '#6B7280',
          icon: '🕊️',
          benefits: [
            {
              level: 1,
              title: 'Diplomat',
              perks: ['Access to neutral zones', 'Mediate conflicts']
            },
            {
              level: 3,
              title: 'Ambassador',
              perks: ['Access to all factions', 'Negotiate treaties', 'Diplomatic missions']
            },
            {
              level: 5,
              title: 'Envoy',
              perks: ['Access to peace talks', 'Prevent wars', 'Establish alliances']
            },
            {
              level: 7,
              title: 'Peacekeeper',
              perks: ['Access to peacekeeping forces', 'Enforce peace', 'Unite factions']
            },
            {
              level: 10,
              title: 'Arbiter',
              perks: ['Access to all diplomatic powers', 'Control galactic politics', 'Achieve universal peace']
            }
          ]
        }
      ];

      setFactions(defaultFactions);

      // Initialize reputation standings
      const initialReputations = new Map<string, ReputationStanding>();
      defaultFactions.forEach(faction => {
        initialReputations.set(faction.id, {
          factionId: faction.id,
          reputation: 0,
          level: 1,
          title: faction.benefits[0].title,
          relationStatus: 'neutral'
        });
      });
      setReputations(initialReputations);

      // Generate reputation missions
      generateReputationMissions(defaultFactions);

      setLoading(false);
    };

    initializeFactions();
  }, []);

  const generateReputationMissions = (factionList: Faction[]) => {
    const missionTemplates = [
      {
        type: 'combat' as const,
        titles: ['Eliminate Pirates', 'Defend Outpost', 'Attack Enemy Base', 'Patrol Sector'],
        descriptions: ['Destroy enemy forces in the sector', 'Protect our installations', 'Launch assault on hostile base', 'Secure the trade routes']
      },
      {
        type: 'trade' as const,
        titles: ['Deliver Cargo', 'Establish Trade Route', 'Negotiate Deal', 'Transport Goods'],
        descriptions: ['Deliver supplies to our outpost', 'Open new trade connections', 'Secure favorable trade agreement', 'Move valuable cargo safely']
      },
      {
        type: 'exploration' as const,
        titles: ['Scout System', 'Map Sector', 'Discover Anomaly', 'Survey Planet'],
        descriptions: ['Explore uncharted system', 'Create detailed sector map', 'Investigate strange readings', 'Analyze planetary resources']
      },
      {
        type: 'diplomacy' as const,
        titles: ['Negotiate Peace', 'Establish Contact', 'Mediate Dispute', 'Form Alliance'],
        descriptions: ['Broker peace agreement', 'Make first contact with faction', 'Resolve territorial conflict', 'Create strategic partnership']
      },
      {
        type: 'research' as const,
        titles: ['Collect Samples', 'Test Technology', 'Analyze Data', 'Recover Artifact'],
        descriptions: ['Gather scientific samples', 'Field test new equipment', 'Process research data', 'Retrieve ancient artifact']
      }
    ];

    const generatedMissions: ReputationMission[] = [];

    factionList.forEach(faction => {
      // Generate 5 missions per faction
      for (let i = 0; i < 5; i++) {
        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const titleIndex = Math.floor(Math.random() * template.titles.length);
        const difficulty = ['easy', 'medium', 'hard', 'extreme'][Math.floor(Math.random() * 4)] as any;
        
        const reputationReward = {
          easy: 100,
          medium: 250,
          hard: 500,
          extreme: 1000
        }[difficulty];

        generatedMissions.push({
          id: `mission-${faction.id}-${i}`,
          factionId: faction.id,
          title: template.titles[titleIndex],
          description: template.descriptions[titleIndex],
          type: template.type,
          reputationReward,
          otherRewards: {
            credits: reputationReward * 100,
            resources: {
              metal: reputationReward * 10,
              crystal: reputationReward * 5
            }
          },
          requirements: {
            minReputation: i * 500,
            minLevel: Math.floor(i / 2) + 1
          },
          difficulty,
          duration: { easy: 30, medium: 60, hard: 120, extreme: 240 }[difficulty],
          available: i === 0 // Only first mission available initially
        });
      }
    });

    setMissions(generatedMissions);
  };

  const getReputationLevel = (reputation: number): number => {
    if (reputation < 0) return 1;
    if (reputation < 1000) return 1;
    if (reputation < 2500) return 2;
    if (reputation < 5000) return 3;
    if (reputation < 7500) return 4;
    if (reputation < 10000) return 5;
    if (reputation < 15000) return 6;
    if (reputation < 20000) return 7;
    if (reputation < 30000) return 8;
    if (reputation < 50000) return 9;
    return 10;
  };

  const getRelationStatus = (reputation: number): ReputationStanding['relationStatus'] => {
    if (reputation < -5000) return 'hostile';
    if (reputation < -1000) return 'unfriendly';
    if (reputation < 1000) return 'neutral';
    if (reputation < 10000) return 'friendly';
    return 'allied';
  };

  const addReputation = async (factionId: string, amount: number) => {
    const current = reputations.get(factionId);
    if (!current) return;

    const newReputation = Math.max(-10000, Math.min(50000, current.reputation + amount));
    const newLevel = getReputationLevel(newReputation);
    const faction = factions.find(f => f.id === factionId);
    const newTitle = faction?.benefits.find(b => b.level === newLevel)?.title || 'Unknown';
    const newStatus = getRelationStatus(newReputation);

    const updated: ReputationStanding = {
      ...current,
      reputation: newReputation,
      level: newLevel,
      title: newTitle,
      relationStatus: newStatus
    };

    setReputations(prev => new Map(prev).set(factionId, updated));

    // Update mission availability
    setMissions(prev => prev.map(mission => {
      if (mission.factionId === factionId) {
        const meetsRequirements = 
          (!mission.requirements.minReputation || newReputation >= mission.requirements.minReputation) &&
          (!mission.requirements.minLevel || newLevel >= mission.requirements.minLevel);
        return { ...mission, available: meetsRequirements };
      }
      return mission;
    }));

    // Save to database
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase.from('faction_reputations').upsert({
          player_id: user.id,
          faction_id: factionId,
          reputation: newReputation,
          level: newLevel,
          title: newTitle,
          relation_status: newStatus,
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving reputation:', error);
    }
  };

  const completeMission = async (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    await addReputation(mission.factionId, mission.reputationReward);

    // Mark mission as completed
    setMissions(prev => prev.filter(m => m.id !== missionId));

    return {
      reputation: mission.reputationReward,
      rewards: mission.otherRewards
    };
  };

  const getFactionReputation = (factionId: string): ReputationStanding | undefined => {
    return reputations.get(factionId);
  };

  const getAvailableMissions = (factionId: string): ReputationMission[] => {
    return missions.filter(m => m.factionId === factionId && m.available);
  };

  const getAllMissions = (factionId: string): ReputationMission[] => {
    return missions.filter(m => m.factionId === factionId);
  };

  const getFactionBenefits = (factionId: string): string[] => {
    const faction = factions.find(f => f.id === factionId);
    const standing = reputations.get(factionId);
    if (!faction || !standing) return [];

    const benefit = faction.benefits.find(b => b.level === standing.level);
    return benefit?.perks || [];
  };

  return {
    factions,
    reputations,
    missions,
    loading,
    addReputation,
    completeMission,
    getFactionReputation,
    getAvailableMissions,
    getAllMissions,
    getFactionBenefits
  };
};