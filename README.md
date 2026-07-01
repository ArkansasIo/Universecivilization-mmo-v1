# 🚀 Galactic Empire - Space Strategy Game

A comprehensive browser-based space strategy game built with React, TypeScript, and Supabase. Build your empire, command fleets, research technologies, and dominate the galaxy!

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Game Systems](#game-systems)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🏛️ Empire Management
- **Empire Creation** - Create and customize your galactic empire
- **Resource Management** - Mine, produce, and trade resources
- **Population System** - Manage citizens across colonies
- **Economy System** - Dynamic market and trading

### 🚢 Fleet & Combat
- **Fleet Management** - Build and command diverse ship fleets
- **Fleet Formations** - Strategic positioning and tactics
- **Combat Simulator** - Test battles before engagement
- **Advanced Combat** - Real-time tactical battles
- **Ship Customization** - Upgrade and enhance vessels
- **Enhanced Ships** - Unlock powerful ship variants

### 🏗️ Construction & Development
- **Buildings** - Construct civil, industrial, and military structures
- **Shipyard** - Design and produce starships
- **Megastructures** - Build massive space constructions
- **Motherships** - Command mobile space fortresses
- **Starbases** - Establish orbital defense platforms
- **Moonbases** - Colonize moons for resources
- **Defense Systems** - Protect your territories

### 🔬 Research & Technology
- **Research Tree** - Unlock advanced technologies
- **Advanced Research** - Cutting-edge innovations
- **Blueprints** - Discover ship and weapon designs
- **Crafting System** - Create items and equipment
- **Master Crafting** - Advanced item creation

### 🌌 Exploration & Expansion
- **Galaxy Map** - Explore star systems
- **Universe Generator** - Procedurally generated galaxies
- **Travel Network** - Establish trade routes
- **Stargate Network** - Instant travel between systems
- **Colonies** - Expand across multiple planets
- **Sectors** - Control strategic regions

### 👥 Multiplayer & Social
- **Alliance System** - Form powerful coalitions
- **Alliance Wars** - Coordinate massive battles
- **Diplomacy** - Negotiate treaties and agreements
- **Guild System** - Join player organizations
- **Messaging** - Communicate with other players
- **Chat System** - Real-time conversations
- **Leaderboard** - Compete for rankings

### 🎯 Missions & Events
- **Quest System** - Complete objectives for rewards
- **Campaign Missions** - Story-driven gameplay
- **Seasonal Events** - Limited-time challenges
- **Planetary Events** - Dynamic world events
- **World Bosses** - Cooperative boss battles

### 💰 Economy & Trading
- **Marketplace** - Buy and sell resources
- **Resource Trading** - Establish trade agreements
- **Trade Routes** - Automated resource transport
- **Black Market** - Illicit goods and services
- **Auction House** - Bid on rare items
- **Store** - Purchase premium items
- **Season Pass** - Exclusive rewards

### 🎖️ Progression & Achievements
- **Player Progression** - Level up and unlock features
- **Skill System** - Develop specialized abilities
- **Achievement System** - Earn badges and rewards
- **Officers** - Recruit and train commanders
- **Universe Reputation** - Build fame across factions

### 🕵️ Intelligence & Warfare
- **Espionage** - Gather intelligence on enemies
- **Intel System** - Strategic information gathering
- **Pirate System** - Raid and plunder
- **Raiding** - Attack enemy installations
- **War Room** - Plan military operations

### 🎮 Game Features
- **Auto-Save System** - Never lose progress
- **Tutorial System** - Learn game mechanics
- **Notification System** - Stay informed of events
- **Admin Panel** - Game management tools
- **Error Handling** - Robust error boundaries

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router** - Navigation
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - Edge Functions
  - Storage

### State Management
- **React Context API** - Global state
- **Custom Hooks** - Reusable logic
- **Local Storage** - Persistent data

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend features)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd galactic-empire
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

---

## 🎮 Game Systems

### Resource System
- **Metal** - Basic construction material
- **Crystal** - Advanced technology component
- **Deuterium** - Fuel for ships and energy
- **Energy** - Powers buildings and systems
- **Credits** - Universal currency
- **Dark Matter** - Rare premium resource

### Building Queue System
- Queue multiple construction projects
- Automatic progression
- Resource validation
- Time-based completion

### Research System
- Technology tree with dependencies
- Research queue management
- Unlock new capabilities
- Boost production and combat

### Combat System
- Turn-based tactical combat
- Fleet formations and positioning
- Weapon types and armor classes
- Damage calculation algorithms
- Battle reports and replays

### Alliance System
- Create and join alliances
- Shared resources and technology
- Coordinated attacks
- Alliance chat and messaging
- War declarations

### Crafting System
- Gather materials
- Unlock recipes
- Craft items and equipment
- Master crafting for rare items
- Blueprint discovery

---

## 📁 Project Structure

```
galactic-empire/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── base/           # Basic UI elements
│   │   └── feature/        # Feature-specific components
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── AdminAuthContext.tsx
│   ├── data/               # Game data and configurations
│   │   ├── achievements.ts
│   │   ├── blueprints/
│   │   ├── buildings/
│   │   ├── ships.ts
│   │   ├── weapons.ts
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useResources.ts
│   │   ├── useFleetManager.ts
│   │   ├── useResearchManager.ts
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── home/
│   │   ├── dashboard/
│   │   ├── fleet/
│   │   ├── research/
│   │   └── ...
│   ├── router/             # Routing configuration
│   │   ├── config.tsx
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   └── gameTypes.ts
│   ├── utils/              # Utility functions
│   │   └── gameCalculations.ts
│   ├── lib/                # Third-party integrations
│   │   └── supabase.ts
│   ├── i18n/               # Internationalization
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── supabase/               # Supabase functions
│   └── functions/
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🏗️ Architecture

### Component Architecture
```
App
├── AuthContext Provider
├── AdminAuthContext Provider
├── GameLoop (Background processing)
├── NotificationCenter
├── ErrorBoundary
└── Router
    ├── Public Routes
    │   ├── Home
    │   ├── Login
    │   └── Register
    ├── Protected Routes (Require Auth)
    │   ├── Dashboard
    │   ├── Fleet Management
    │   ├── Research
    │   ├── Buildings
    │   └── ...
    └── Admin Routes
        ├── Admin Login
        ├── Admin Register
        └── Admin Dashboard
```

### Data Flow
```
User Action → Component → Custom Hook → Context/State → Supabase → Update UI
```

### State Management Strategy
- **Local State** - Component-specific data (useState)
- **Context State** - Shared authentication and global data
- **Custom Hooks** - Business logic and data fetching
- **Local Storage** - Persistent game state
- **Supabase** - Server-side data and real-time updates

### Key Design Patterns
- **Custom Hooks Pattern** - Encapsulate game logic
- **Context Pattern** - Share authentication state
- **Component Composition** - Build complex UIs
- **Error Boundary Pattern** - Graceful error handling
- **Observer Pattern** - Real-time notifications

---

## 🔑 Key Custom Hooks

| Hook | Purpose |
|------|---------|
| `useResources` | Manage resource production and consumption |
| `useFleetManager` | Control ship fleets and movements |
| `useResearchManager` | Handle technology research |
| `useBuildingQueue` | Manage construction projects |
| `useCombatSimulator` | Simulate battles |
| `useAllianceSystem` | Alliance management |
| `useMarketplace` | Trading and economy |
| `useQuestSystem` | Mission and quest tracking |
| `useAchievementSystem` | Achievement unlocking |
| `useGameLoop` | Background game processing |

---

## 🎨 UI/UX Features

- **Responsive Design** - Works on all screen sizes
- **Dark Theme** - Space-themed dark interface
- **Smooth Animations** - Polished transitions
- **Real-time Updates** - Live data synchronization
- **Notification System** - In-game alerts
- **Loading States** - Clear feedback
- **Error Handling** - User-friendly error messages
- **Accessibility** - ARIA labels and keyboard navigation

---

## 🔐 Authentication & Security

- **Supabase Auth** - Secure user authentication
- **Protected Routes** - Route guards for authenticated pages
- **Admin System** - Separate admin authentication
- **Row Level Security** - Database-level permissions
- **JWT Tokens** - Secure session management

---

## 📊 Database Schema

### Core Tables
- **users** - Player accounts
- **empires** - Player empires
- **fleets** - Ship fleets
- **ships** - Individual ships
- **buildings** - Constructed buildings
- **research** - Technology progress
- **resources** - Resource stockpiles
- **alliances** - Player alliances
- **messages** - Player communications
- **quests** - Mission tracking
- **achievements** - Achievement progress

---

## 🎯 Game Balance

### Resource Production
- Buildings generate resources over time
- Research boosts production rates
- Population affects efficiency
- Energy requirements limit expansion

### Combat Balance
- Rock-paper-scissors weapon system
- Fleet composition matters
- Technology provides advantages
- Tactics and formations crucial

### Progression Curve
- Early game: Resource gathering
- Mid game: Expansion and research
- Late game: Megastructures and warfare
- End game: Universe domination

---

## 🐛 Debugging

### Development Tools
```bash
# Run with debug logging
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### Common Issues
- **Supabase Connection** - Check environment variables
- **Build Errors** - Clear node_modules and reinstall
- **Type Errors** - Run `npm run type-check`

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Docker
```bash
docker build -t galactic-empire .
docker run -p 3000:3000 galactic-empire
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent formatting

---

## 📝 Roadmap

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] 3D graphics (Three.js)
- [ ] Voice chat integration
- [ ] Tournament system
- [ ] Clan wars

### Version 2.5
- [ ] AI opponents
- [ ] Procedural missions
- [ ] Custom game modes
- [ ] Mod support
- [ ] Steam integration

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Development Team** - Initial work and ongoing development

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase for backend infrastructure
- TailwindCSS for styling utilities
- Lucide for beautiful icons
- The gaming community for feedback

---

## 📞 Support

- **Documentation** - [Wiki](wiki-url)
- **Discord** - [Join our community](discord-url)
- **Email** - support@galacticempire.game
- **Bug Reports** - [GitHub Issues](issues-url)

---

## 🎮 Play Now!

Visit [galacticempire.game](https://galacticempire.game) to start your journey!

---

**May your empire span the stars! 🌟**
