import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import GameRoutesLayout from '../components/feature/GameRoutesLayout';
import AdminRoutesLayout from '../components/feature/AdminRoutesLayout';

// Public / auth pages (no game layout)
const HomePage = lazy(() => import('../pages/home/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const RegisterPage = lazy(() => import('../pages/register/page'));
const EmpireCreationPage = lazy(() => import('../pages/empire-creation/page'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AdminLogin = lazy(() => import('../pages/admin-login/page'));
const AdminDashboard = lazy(() => import('../pages/admin-dashboard/page'));
const AdminRegister = lazy(() => import('../pages/admin-register/page'));
const ResetPasswordPage = lazy(() => import('../pages/reset-password/page'));
const VerifyEmailPage = lazy(() => import('../pages/verify-email/page'));
const AuthCallbackPage = lazy(() => import('../pages/auth-callback/page'));

// Game pages (wrapped by GameRoutesLayout)
const DashboardPage = lazy(() => import('../pages/dashboard/page'));
const FleetPage = lazy(() => import('../pages/fleet/page'));
const ResearchPage = lazy(() => import('../pages/research/page'));
const BuildingsPage = lazy(() => import('../pages/buildings/page'));
const DefensePage = lazy(() => import('../pages/defense/page'));
const GalaxyPage = lazy(() => import('../pages/galaxy/page'));
const AlliancePage = lazy(() => import('../pages/alliance/page'));
const StoragePage = lazy(() => import('../pages/storage/page'));
const MegastructuresPage = lazy(() => import('../pages/megastructures/page'));
const UniversePage = lazy(() => import('../pages/universe/page'));
const AdvancedResearchPage = lazy(() => import('../pages/advanced-research/page'));
const MothershipsPage = lazy(() => import('../pages/motherships/page'));
const UnitsPage = lazy(() => import('../pages/units/page'));
const TrainingCenterPage = lazy(() => import('../pages/training-center/page'));
const GroundCombatPage = lazy(() => import('../pages/ground-combat/page'));
const StarshipsPage = lazy(() => import('../pages/starships/page'));
const EmpirePage = lazy(() => import('../pages/empire/page'));
const WorldBossesPage = lazy(() => import('../pages/world-bosses/page'));
const TravelNetworkPage = lazy(() => import('../pages/travel-network/page'));
const DiplomacyPage = lazy(() => import('../pages/diplomacy/page'));
const OfficersPage = lazy(() => import('../pages/officers/page'));
const EventsPage = lazy(() => import('../pages/events/page'));
const LeaderboardPage = lazy(() => import('../pages/leaderboard/page'));
const CombatSimulatorPage = lazy(() => import('../pages/combat-simulator/page'));
const SkillsPage = lazy(() => import('../pages/skills/page'));
const AchievementsPage = lazy(() => import('../pages/achievements/page'));
const MarketplacePage = lazy(() => import('../pages/marketplace/page'));
const MissionsPage = lazy(() => import('../pages/missions/page'));
const MessagesPage = lazy(() => import('../pages/messages/page'));
const ShipyardPage = lazy(() => import('../pages/shipyard/page'));
const EspionagePage = lazy(() => import('../pages/espionage/page'));
const ProfilePage = lazy(() => import('../pages/profile/page'));
const ChatPage = lazy(() => import('../pages/chat/page'));
const AuctionPage = lazy(() => import('../pages/auction/page'));
const QuestsPage = lazy(() => import('../pages/quests/page'));
const TradeRoutesPage = lazy(() => import('../pages/trade-routes/page'));
const BlackMarketPage = lazy(() => import('../pages/black-market/page'));
const PlanetaryEventsPage = lazy(() => import('../pages/planetary-events/page'));
const FleetFormationsPage = lazy(() => import('../pages/fleet-formations/page'));
const FleetCombatPage = lazy(() => import('../pages/fleet-combat/page'));
const ShipUpgradesPage = lazy(() => import('../pages/ship-upgrades/page'));
const GameTestPage = lazy(() => import('../pages/game-test/page'));
const PiratesPage = lazy(() => import('../pages/pirates/page'));
const SeasonalEventsPage = lazy(() => import('../pages/seasonal-events/page'));
const MasterCraftingPage = lazy(() => import('../pages/master-crafting/page'));
const PopulationManagementPage = lazy(() => import('../pages/population/page'));
const ResourceTradingPage = lazy(() => import('../pages/resource-trading/page'));
const StorePage = lazy(() => import('../pages/store/page'));
const SeasonPassPage = lazy(() => import('../pages/season-pass/page'));
const ColoniesPage = lazy(() => import('../pages/colonies/page'));
const MoonBasesPage = lazy(() => import('../pages/moonbases/page'));
const StarbasesPage = lazy(() => import('../pages/starbases/page'));
const BlueprintsPage = lazy(() => import('../pages/blueprints/page'));
const GalaxyMapPage = lazy(() => import('../pages/galaxy-map/page'));
const SectorsPage = lazy(() => import('../pages/sectors/page'));
const EnhancedShipsPage = lazy(() => import('../pages/enhanced-ships/page'));
const EnhancedMothershipPage = lazy(() => import('../pages/enhanced-motherships/page'));
const EnhancedMegastructuresPage = lazy(() => import('../pages/enhanced-megastructures/page'));
const CraftingPage = lazy(() => import('../pages/crafting/page'));
const CraftingForgePage = lazy(() => import('../pages/crafting-forge/page'));
const CraftingMaterialsPage = lazy(() => import('../pages/crafting-materials/page'));
const CraftingDronesPage = lazy(() => import('../pages/crafting-drones/page'));
const CraftingAugmentationsPage = lazy(() => import('../pages/crafting-augmentations/page'));
const CraftingArtifactsPage = lazy(() => import('../pages/crafting-artifacts/page'));
const CraftingDismantlePage = lazy(() => import('../pages/crafting-dismantle/page'));
const CraftingSkillTreesPage = lazy(() => import('../pages/crafting-skill-trees/page'));
const CraftingRankPage = lazy(() => import('../pages/crafting-rank/page'));
const CraftingRecipeUnlocksPage = lazy(() => import('../pages/crafting-recipe-unlocks/page'));
const SeedDiscoveryPage = lazy(() => import('../pages/seed-discovery/page'));
const WeaponsmithingPage = lazy(() => import('../pages/crafting-skill-trees/weaponsmithing/page'));
const ArmorsmithingPage = lazy(() => import('../pages/crafting-skill-trees/armorsmithing/page'));
const EngineeringSkillPage = lazy(() => import('../pages/crafting-skill-trees/engineering/page'));
const AlchemyPage = lazy(() => import('../pages/crafting-skill-trees/alchemy/page'));
const NanotechnologyPage = lazy(() => import('../pages/crafting-skill-trees/nanotechnology/page'));
const StargateNetworkPage = lazy(() => import('../pages/stargate-network/page'));
const RealmsPage = lazy(() => import('../pages/realms/page'));
const UniverseLeaderboardPage = lazy(() => import('../pages/universe-leaderboard/page'));
const UniverseWarEventsPage = lazy(() => import('../pages/universe-war-events/page'));
const DiplomacyMapPage = lazy(() => import('../pages/diplomacy-map/page'));
const StellarisViewPage = lazy(() => import('../pages/stellaris-view/page'));
const CosmicHierarchyPage = lazy(() => import('../pages/cosmic-hierarchy/page'));
const RacesExplorerPage = lazy(() => import('../pages/races-explorer/page'));
const WarRoomPage = lazy(() => import('../pages/war-room/page'));
const IntelPage = lazy(() => import('../pages/intel/page'));
const EmpiresAtWarPage = lazy(() => import('../pages/empires-at-war/page'));
const BountiesPage = lazy(() => import('../pages/bounties/page'));
const InsurancePage = lazy(() => import('../pages/insurance/page'));
const TermsPage = lazy(() => import('../pages/terms/page'));
const PrivacyPage = lazy(() => import('../pages/privacy/page'));
const SupportPage = lazy(() => import('../pages/support/page'));
const ChangelogPage = lazy(() => import('../pages/changelog/page'));
const GalacticCalendarPage = lazy(() => import('../pages/galactic-calendar/page'));

// New OGameX-equivalent pages
const ExpeditionsPage = lazy(() => import('../pages/expeditions/page'));
const ACSPage = lazy(() => import('../pages/acs/page'));
const SensorPhalanxPage = lazy(() => import('../pages/sensor-phalanx/page'));

// ── New imports for the 3D page
const Universe3DPage = lazy(() => import('../pages/universe-3d/page'));

const FoodWaterDiseasePage = lazy(() => import('../pages/food-water-disease/page'));

const ShipCustomizationPage = lazy(() => import('../pages/ship-customization/page'));
const CampaignPage = lazy(() => import('../pages/campaign/page'));
// ── New imports for the Power Grid
const PowerGridPage = lazy(() => import('../pages/power-grid/page'));
const ReactorResearchPage = lazy(() => import('../pages/reactor-research/page'));
const AlcPowerTechPage = lazy(() => import('../pages/alc-power-tech/page'));

const routes: RouteObject[] = [
  // ── Public routes (no game shell) ──────────────────────────────────
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/empire-creation', element: <EmpireCreationPage /> },
  { path: '/admin-login', element: <AdminLogin /> },
  { path: '/admin/login', element: <AdminLogin /> },

  // ── Admin routes (wrapped by AdminRoutesLayout) ─────────────────────
  {
    element: <AdminRoutesLayout />,
    children: [
      { path: '/admin-dashboard', element: <AdminDashboard /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin-register', element: <AdminRegister /> },
      { path: '/admin/register', element: <AdminRegister /> },
    ],
  },

  // ── Game routes (wrapped by OGame-style GameRoutesLayout) ───────────
  {
    element: <GameRoutesLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },

      // Empire
      { path: '/empire', element: <EmpirePage /> },
      { path: '/buildings', element: <BuildingsPage /> },
      { path: '/colonies', element: <ColoniesPage /> },
      { path: '/population', element: <PopulationManagementPage /> },
      { path: '/storage', element: <StoragePage /> },
      { path: '/megastructures', element: <MegastructuresPage /> },
      { path: '/enhanced-megastructures', element: <EnhancedMegastructuresPage /> },
      { path: '/travel-network', element: <TravelNetworkPage /> },
      { path: '/starbases', element: <StarbasesPage /> },
      { path: '/moonbases', element: <MoonBasesPage /> },
      { path: '/food-water-disease', element: <FoodWaterDiseasePage /> },
      { path: '/power-grid', element: <PowerGridPage /> },
      { path: '/reactor-research', element: <ReactorResearchPage /> },
      { path: '/alc-power-tech', element: <AlcPowerTechPage /> },

      // Military
      { path: '/fleet', element: <FleetPage /> },
      { path: '/shipyard', element: <ShipyardPage /> },
      { path: '/starships', element: <StarshipsPage /> },
      { path: '/motherships', element: <MothershipsPage /> },
      { path: '/enhanced-ships', element: <EnhancedShipsPage /> },
      { path: '/enhanced-motherships', element: <EnhancedMothershipPage /> },
      { path: '/ship-upgrades', element: <ShipUpgradesPage /> },
      { path: '/ship-customization', element: <ShipCustomizationPage /> },
      { path: '/fleet-formations', element: <FleetFormationsPage /> },
      { path: '/fleet-combat', element: <FleetCombatPage /> },
      { path: '/defense', element: <DefensePage /> },
      { path: '/officers', element: <OfficersPage /> },
      { path: '/units', element: <UnitsPage /> },
      { path: '/training-center', element: <TrainingCenterPage /> },
      { path: '/ground-combat', element: <GroundCombatPage /> },
      { path: '/combat-simulator', element: <CombatSimulatorPage /> },
      { path: '/war-room', element: <WarRoomPage /> },
      { path: '/missions', element: <MissionsPage /> },
      { path: '/campaign', element: <CampaignPage /> },
      { path: '/expeditions', element: <ExpeditionsPage /> },
      { path: '/acs', element: <ACSPage /> },

      // Research
      { path: '/research', element: <ResearchPage /> },
      { path: '/advanced-research', element: <AdvancedResearchPage /> },
      { path: '/skills', element: <SkillsPage /> },
      { path: '/blueprints', element: <BlueprintsPage /> },

      // Crafting
      { path: '/crafting', element: <CraftingPage /> },
      { path: '/master-crafting', element: <MasterCraftingPage /> },
      { path: '/crafting-forge', element: <CraftingForgePage /> },
      { path: '/crafting-materials', element: <CraftingMaterialsPage /> },
      { path: '/crafting-drones', element: <CraftingDronesPage /> },
      { path: '/crafting-augmentations', element: <CraftingAugmentationsPage /> },
      { path: '/crafting-artifacts', element: <CraftingArtifactsPage /> },
      { path: '/crafting-dismantle', element: <CraftingDismantlePage /> },
      { path: '/crafting-rank', element: <CraftingRankPage /> },
      { path: '/crafting-recipe-unlocks', element: <CraftingRecipeUnlocksPage /> },
      { path: '/crafting-skill-trees', element: <CraftingSkillTreesPage /> },
      { path: '/crafting-skill-trees/weaponsmithing', element: <WeaponsmithingPage /> },
      { path: '/crafting-skill-trees/armorsmithing', element: <ArmorsmithingPage /> },
      { path: '/crafting-skill-trees/engineering', element: <EngineeringSkillPage /> },
      { path: '/crafting-skill-trees/alchemy', element: <AlchemyPage /> },
      { path: '/crafting-skill-trees/nanotechnology', element: <NanotechnologyPage /> },

      // Galaxy
      { path: '/galaxy', element: <GalaxyPage /> },
      { path: '/galaxy-map', element: <GalaxyMapPage /> },
      { path: '/universe', element: <UniversePage /> },
      { path: '/universe-3d', element: <Universe3DPage /> },
      { path: '/sectors', element: <SectorsPage /> },
      { path: '/stargate-network', element: <StargateNetworkPage /> },
      { path: '/realms', element: <RealmsPage /> },
      { path: '/seed-discovery', element: <SeedDiscoveryPage /> },
      { path: '/universe-leaderboard', element: <UniverseLeaderboardPage /> },
      { path: '/universe-war-events', element: <UniverseWarEventsPage /> },
      { path: '/empires-at-war', element: <EmpiresAtWarPage /> },
      { path: '/diplomacy-map', element: <DiplomacyMapPage /> },
      { path: '/stellaris-view', element: <StellarisViewPage /> },
      { path: '/cosmic-hierarchy', element: <CosmicHierarchyPage /> },
      { path: '/races-explorer', element: <RacesExplorerPage /> },
      { path: '/sensor-phalanx', element: <SensorPhalanxPage /> },

      // Economy
      { path: '/marketplace', element: <MarketplacePage /> },
      { path: '/resource-trading', element: <ResourceTradingPage /> },
      { path: '/trade-routes', element: <TradeRoutesPage /> },
      { path: '/insurance', element: <InsurancePage /> },
      { path: '/auction', element: <AuctionPage /> },
      { path: '/black-market', element: <BlackMarketPage /> },

      // Alliance / Social
      { path: '/alliance', element: <AlliancePage /> },
      { path: '/diplomacy', element: <DiplomacyPage /> },
      { path: '/espionage', element: <EspionagePage /> },
      { path: '/intel', element: <IntelPage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },

      // Activities
      { path: '/pirates', element: <PiratesPage /> },
      { path: '/bounties', element: <BountiesPage /> },
      { path: '/world-bosses', element: <WorldBossesPage /> },
      { path: '/quests', element: <QuestsPage /> },
      { path: '/seasonal-events', element: <SeasonalEventsPage /> },
      { path: '/planetary-events', element: <PlanetaryEventsPage /> },
      { path: '/season-pass', element: <SeasonPassPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/events', element: <EventsPage /> },

      // Store
      { path: '/store', element: <StorePage /> },

      // Profile / misc
      { path: '/profile', element: <ProfilePage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/changelog', element: <ChangelogPage /> },
      { path: '/galactic-calendar', element: <GalacticCalendarPage /> },
      { path: '/game-test', element: <GameTestPage /> },
    ],
  },

  { path: '*', element: <NotFound /> },
];

export { routes };