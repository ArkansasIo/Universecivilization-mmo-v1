# Hooks

69 custom React hooks that encapsulate game logic, state management, and side effects.

## Categories

### Auth & Accounts
| Hook | File | Purpose |
|---|---|---|
| [useAuth](useAuth.md) | `src/contexts/AuthContext` | User authentication, session, sign out |
| [useAdminPanel](useAdminPanel.md) | `src/hooks/useAdminPanel` | Admin dashboard operations |

### Economy & Resources
| Hook | File | Purpose |
|---|---|---|
| [useResources](useResources.md) | `src/hooks/useResources` | Resource production and balances |
| [useEconomySystem](useEconomySystem.md) | `src/hooks/useEconomySystem` | Full economic simulation |
| [useMarketplace](useMarketplace.md) | `src/hooks/useMarketplace` | Marketplace trades and orders |
| [useResourceTrading](useResourceTrading.md) | `src/hooks/useResourceTrading` | Resource exchange system |
| [useTradeRoutes](useTradeRoutes.md) | `src/hooks/useTradeRoutes` | Trade route management |
| [useBlackMarket](useBlackMarket.md) | `src/hooks/useBlackMarket` | Black market operations |
| [useStore](useStore.md) | `src/hooks/useStore` | Premium store purchases |
| [useSeasonPass](useSeasonPass.md) | `src/hooks/useSeasonPass` | Season pass progression |

### Military & Fleet
| Hook | File | Purpose |
|---|---|---|
| [useFleetManager](useFleetManager.md) | `src/hooks/useFleetManager` | Fleet deployment and missions |
| [useEnhancedShips](useEnhancedShips.md) | `src/hooks/useEnhancedShips` | Enhanced ship management |
| [useMothershipManager](useMothershipManager.md) | `src/hooks/useMothershipManager` | Mothership operations |
| [useFleetFormations](useFleetFormations.md) | `src/hooks/useFleetFormations` | Fleet formation bonuses |
| [useAdvancedCombat](useAdvancedCombat.md) | `src/hooks/useAdvancedCombat` | Combat resolution logic |
| [useGroundCombat](useGroundCombat.md) | `src/hooks/useGroundCombat` | Planetary ground combat |
| [useCombatSimulator](useCombatSimulator.md) | `src/hooks/useCombatSimulator` | Battle simulation |
| [useShipProduction](useShipProduction.md) | `src/hooks/useShipProduction` | Ship construction queue |
| [useShipUpgrades](useShipUpgrades.md) | `src/hooks/useShipUpgrades` | Ship upgrade system |
| [useShipClassSystem](useShipClassSystem.md) | `src/hooks/useShipClassSystem` | Ship classification |
| [useDefenseSystem](useDefenseSystem.md) | `src/hooks/useDefenseSystem` | Defense management |

### Research & Crafting
| Hook | File | Purpose |
|---|---|---|
| [useResearchManager](useResearchManager.md) | `src/hooks/useResearchManager` | Research queue and progress |
| [useBlueprintSystem](useBlueprintSystem.md) | `src/hooks/useBlueprintSystem` | Blueprint unlocks |
| [useCrafting](useCrafting.md) | `src/hooks/useCrafting` | Base crafting system |
| [useMasterCrafting](useMasterCrafting.md) | `src/hooks/useMasterCrafting` | Advanced crafting |
| [useCraftingRank](useCraftingRank.md) | `src/hooks/useCraftingRank` | Crafting rank/titles |
| [useRecipeUnlocks](useRecipeUnlocks.md) | `src/hooks/useRecipeUnlocks` | Recipe discovery |
| [useMaterialWishlist](useMaterialWishlist.md) | `src/hooks/useMaterialWishlist` | Material tracking |

### Social & Communication
| Hook | File | Purpose |
|---|---|---|
| [useAllianceSystem](useAllianceSystem.md) | `src/hooks/useAllianceSystem` | Alliance management |
| [useAllianceWar](useAllianceWar.md) | `src/hooks/useAllianceWar` | Alliance warfare |
| [useDiplomacy](useDiplomacy.md) | `src/hooks/useDiplomacy` | Diplomatic relations |
| [useMessaging](useMessaging.md) | `src/hooks/useMessaging` | In-game messages |
| [useNotifications](useNotifications.md) | `src/hooks/useNotifications` | Notification system |
| [useGameNotifications](useGameNotifications.md) | `src/hooks/useGameNotifications` | Game event notifications |

### Exploration & Events
| Hook | File | Purpose |
|---|---|---|
| [usePirateSystem](usePirateSystem.md) | `src/hooks/usePirateSystem` | Pirate encounters |
| [useBountySystem](useBountySystem.md) | `src/hooks/useBountySystem` | Bounty hunting |
| [useWorldBosses](useWorldBosses.md) | `src/hooks/useWorldBosses` | World boss battles |
| [useQuestSystem](useQuestSystem.md) | `src/hooks/useQuestSystem` | Quest management |
| [useAchievementSystem](useAchievementSystem.md) | `src/hooks/useAchievementSystem` | Achievement tracking |
| [useSeasonalEvents](useSeasonalEvents.md) | `src/hooks/useSeasonalEvents` | Seasonal event handling |
| [usePlanetaryEvents](usePlanetaryEvents.md) | `src/hooks/usePlanetaryEvents` | Planetary event system |
| [useGameEventSystem](useGameEventSystem.md) | `src/hooks/useGameEventSystem` | Game event bus |
| [useTimeBasedEvents](useTimeBasedEvents.md) | `src/hooks/useTimeBasedEvents` | Time-based event triggers |

### Empire & Colonies
| Hook | File | Purpose |
|---|---|---|
| [useColonyManagement](useColonyManagement.md) | `src/hooks/useColonyManagement` | Colony administration |
| [usePopulationSystem](usePopulationSystem.md) | `src/hooks/usePopulationSystem` | Population simulation |
| [useBuildingQueue](useBuildingQueue.md) | `src/hooks/useBuildingQueue` | Building construction queue |
| [useMegastructureManager](useMegastructureManager.md) | `src/hooks/useMegastructureManager` | Megastructure oversight |
| [useInterstellarObjects](useInterstellarObjects.md) | `src/hooks/useInterstellarObjects` | Celestial object management |

### Power & Utilities
| Hook | File | Purpose |
|---|---|---|
| [usePowerGrid](usePowerGrid.md) | `src/hooks/usePowerGrid` | Power grid simulation |
| [usePowerConsumption](usePowerConsumption.md) | `src/hooks/usePowerConsumption` | Power usage tracking |
| [useGridOverload](useGridOverload.md) | `src/hooks/useGridOverload` | Grid overload events |

### Travel & Universe
| Hook | File | Purpose |
|---|---|---|
| [useTravelSystem](useTravelSystem.md) | `src/hooks/useTravelSystem` | Ship travel and navigation |
| [useStargateNetwork](useStargateNetwork.md) | `src/hooks/useStargateNetwork` | Stargate travel |
| [useTradeRoutes](useTradeRoutes.md) | `src/hooks/useTradeRoutes` | Trade route simulation |
| [useSeedSystem](useSeedSystem.md) | `src/hooks/useSeedSystem` | Universe seed management |
| [useUniverseGenerator](useUniverseGenerator.md) | `src/hooks/useUniverseGenerator` | Procedural universe gen |
| [useUniverseReputation](useUniverseReputation.md) | `src/hooks/useUniverseReputation` | Faction reputation |

### Game Systems
| Hook | File | Purpose |
|---|---|---|
| [useBackgroundProcessor](useBackgroundProcessor.md) | `src/hooks/useBackgroundProcessor` | 15s background loop |
| [useGameLoop](useGameLoop.md) | `src/hooks/useGameLoop` | Main game tick loop |
| [useGameTime](useGameTime.md) | `src/hooks/useGameTime` | In-game time system |
| [useAutoSave](useAutoSave.md) | `src/hooks/useAutoSave` | Auto-save functionality |
| [useLeaderboard](useLeaderboard.md) | `src/hooks/useLeaderboard` | Leaderboard data |
| [usePlayerProgression](usePlayerProgression.md) | `src/hooks/usePlayerProgression` | Player level/XP system |
| [useSkillSystem](useSkillSystem.md) | `src/hooks/useSkillSystem` | Skill tree management |
| [useInsuranceSystem](useInsuranceSystem.md) | `src/hooks/useInsuranceSystem` | Fleet insurance |
| [useRaiding](useRaiding.md) | `src/hooks/useRaiding` | PvP raiding system |

### UI / Support
| Hook | File | Purpose |
|---|---|---|
| [useTheme](useTheme.md) | `src/hooks/useTheme` | Dark/light theme |
| [useTutorialSystem](useTutorialSystem.md) | `src/hooks/useTutorialSystem` | New player tutorial |
| [useRealTimeProduction](useRealTimeProduction.md) | `src/hooks/useRealTimeProduction` | Live production display |
