import { Link } from 'react-router-dom';

export default function ChangelogPage() {
  const updates = [
    {
      version: '3.0.0',
      date: 'May 28, 2026',
      type: 'major',
      changes: [
        { category: 'Authentication & Access', items: [
          'Rebuilt login, registration, and logout systems with full Supabase integration',
          'Added resend-verification-email edge function for real email confirmation flows',
          'Added "Resend Verification" button on login page for unconfirmed users',
          'Added email preferences section in user profile (change email, toggle notifications)',
          'Login page now detects "email not confirmed" errors and shows inline resend option',
          'Register page redirect path fixed from /auth-callback to /auth/callback',
          'New "Continue as Guest" quick-access option for anonymous preview access',
          'Auto-login demo account via URL flag (?demo=true) for instant preview'
        ]},
        { category: 'Admin & Moderation', items: [
          'New admin verification dashboard — monitor pending verifications, resend emails manually',
          'Super admin-only "Verifications" tab with stats cards and filterable user list',
          'Force-verify accounts via admin-verify-user edge function with audit logging',
          'Admin audit logs now track force_verify_user actions with emerald badge',
          'Admin route guards with AdminAuthContext protecting all /admin/* routes'
        ]},
        { category: 'Game UI Improvements', items: [
          'Added "Access Account" quick-auth dropdown in the game layout top bar',
          'Logged-out users now see Login, Register, Demo Account, and Home in the top bar',
          'Logged-in user menu now includes Profile, Empire, Achievements, Store, and Logout',
          'Home page nav now shows Log Out button when authenticated',
          'Profile settings tab now has End Session (logout) card above the Danger Zone'
        ]},
        { category: 'Security & Backend', items: [
          'list-pending-verifications edge function for paginated, filterable auth user queries',
          'admin-verify-user edge function with double security (JWT check + admin_users table)',
          'All verification actions logged to admin_logs table for full audit trail',
          'Session-only mode for "Remember me" disabled logins — no localStorage persistence'
        ]}
      ]
    },
    {
      version: '2.5.0',
      date: 'January 15, 2024',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Added World Boss system with epic galaxy-wide battles',
          'Introduced Season Pass with exclusive rewards',
          'New Mothership class vessels with unique abilities',
          'Master Crafting system for legendary equipment',
          'Planetary Events system with dynamic challenges'
        ]},
        { category: 'Improvements', items: [
          'Enhanced fleet formation system with new tactical options',
          'Improved alliance war mechanics and rewards',
          'Optimized resource production calculations',
          'Better mobile device performance'
        ]},
        { category: 'Balance Changes', items: [
          'Reduced Battleship construction time by 15%',
          'Increased Crystal Mine output by 10%',
          'Adjusted combat formulas for better balance',
          'Rebalanced research costs for mid-tier technologies'
        ]}
      ]
    },
    {
      version: '2.4.2',
      date: 'January 8, 2024',
      type: 'patch',
      changes: [
        { category: 'Bug Fixes', items: [
          'Fixed issue where fleet formations were not saving correctly',
          'Resolved crash when viewing large alliance member lists',
          'Fixed resource overflow display in storage page',
          'Corrected espionage mission success rate calculations'
        ]},
        { category: 'Improvements', items: [
          'Added confirmation dialog for expensive purchases',
          'Improved loading times for galaxy map',
          'Enhanced chat message filtering'
        ]}
      ]
    },
    {
      version: '2.4.0',
      date: 'December 28, 2023',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Megastructures: Build massive space constructions',
          'Moonbase system for advanced resource gathering',
          'Starbase upgrades with new defensive capabilities',
          'Black Market for rare items and resources',
          'Advanced Research tree with 50+ new technologies'
        ]},
        { category: 'Improvements', items: [
          'Redesigned UI for better user experience',
          'Added quick navigation shortcuts',
          'Improved combat simulator with detailed statistics',
          'Enhanced alliance management tools'
        ]},
        { category: 'Balance Changes', items: [
          'Increased Deuterium Synthesizer efficiency',
          'Reduced Espionage Probe cost',
          'Adjusted defense structure effectiveness',
          'Rebalanced officer abilities'
        ]}
      ]
    },
    {
      version: '2.3.5',
      date: 'December 15, 2023',
      type: 'patch',
      changes: [
        { category: 'Bug Fixes', items: [
          'Fixed issue with trade route calculations',
          'Resolved problem with quest completion tracking',
          'Fixed display bug in leaderboard rankings',
          'Corrected building queue time estimates'
        ]},
        { category: 'Improvements', items: [
          'Added tooltips for complex game mechanics',
          'Improved notification system',
          'Enhanced search functionality in marketplace'
        ]}
      ]
    },
    {
      version: '2.3.0',
      date: 'December 1, 2023',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Alliance Wars: Compete for territory and rewards',
          'Officer system with unique abilities and skills',
          'Trade Routes for automated resource management',
          'Crafting system for equipment and upgrades',
          'Achievement system with 100+ achievements'
        ]},
        { category: 'Improvements', items: [
          'Completely redesigned galaxy map',
          'New tutorial system for beginners',
          'Enhanced combat animations',
          'Improved resource management interface'
        ]},
        { category: 'Balance Changes', items: [
          'Adjusted ship combat values across all classes',
          'Rebalanced resource costs for buildings',
          'Modified research time requirements',
          'Updated defense structure stats'
        ]}
      ]
    },
    {
      version: '2.2.0',
      date: 'November 15, 2023',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Espionage system for intelligence gathering',
          'Diplomacy mechanics between players',
          'Quest system with story campaigns',
          'Seasonal events with limited-time rewards',
          'Skill tree for player progression'
        ]},
        { category: 'Improvements', items: [
          'Added auto-save functionality',
          'Improved server performance',
          'Enhanced mobile responsiveness',
          'Better error handling and messages'
        ]}
      ]
    },
    {
      version: '2.1.0',
      date: 'November 1, 2023',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Colony management system',
          'Fleet formations and tactics',
          'Marketplace for player trading',
          'Leaderboard rankings',
          'Daily rewards system'
        ]},
        { category: 'Improvements', items: [
          'Optimized database queries',
          'Improved UI animations',
          'Enhanced security measures',
          'Better mobile experience'
        ]}
      ]
    },
    {
      version: '2.0.0',
      date: 'October 15, 2023',
      type: 'major',
      changes: [
        { category: 'New Features', items: [
          'Complete game redesign with modern UI',
          'Alliance system for cooperative gameplay',
          'Advanced combat mechanics',
          'Research technology tree',
          'Multiple ship classes and types'
        ]},
        { category: 'Improvements', items: [
          'Rebuilt from ground up for better performance',
          'New database architecture',
          'Improved security and anti-cheat measures',
          'Enhanced real-time updates'
        ]}
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'major': return 'from-cyan-500 to-blue-500';
      case 'patch': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'major': return 'ri-rocket-line';
      case 'patch': return 'ri-tools-line';
      default: return 'ri-file-list-line';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0F1A] via-[#0F1419] to-[#050A14]">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-rocket-2-fill text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              UNIVERSE CIVILIZATION
            </span>
          </Link>
          <Link to="/" className="px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all cursor-pointer whitespace-nowrap">
            <i className="ri-home-line mr-2"></i>Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-black text-white mb-4">Changelog</h1>
        <p className="text-xl text-gray-400">Track all updates, improvements, and fixes</p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent"></div>

          {/* Updates */}
          <div className="space-y-12">
            {updates.map((update, index) => (
              <div key={index} className="relative pl-20">
                {/* Timeline Dot */}
                <div className={`absolute left-0 w-16 h-16 bg-gradient-to-br ${getTypeColor(update.type)} rounded-full flex items-center justify-center border-4 border-[#0A0F1A]`}>
                  <i className={`${getTypeIcon(update.type)} text-white text-2xl`}></i>
                </div>

                {/* Content */}
                <div className="bg-white/5 border border-cyan-500/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">Version {update.version}</h2>
                      <p className="text-gray-400 text-sm">{update.date}</p>
                    </div>
                    <span className={`px-3 py-1 bg-gradient-to-r ${getTypeColor(update.type)} text-white text-xs font-bold rounded-full uppercase`}>
                      {update.type}
                    </span>
                  </div>

                  {update.changes.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center">
                        <i className="ri-checkbox-circle-line mr-2"></i>
                        {section.category}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-300 flex items-start">
                            <i className="ri-arrow-right-s-line text-cyan-500 mt-1 mr-2 flex-shrink-0"></i>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* End of Timeline */}
          <div className="relative pl-20 mt-12">
            <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-4 border-[#0A0F1A]">
              <i className="ri-flag-line text-gray-400 text-2xl"></i>
            </div>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400">This is where it all began...</p>
              <p className="text-gray-500 text-sm mt-2">October 1, 2023 - Initial Release</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6">Join our Discord community to get notified about new updates</p>
          <a 
            href="https://discord.gg/stellardominion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-discord-line mr-2"></i>Join Discord
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; 2024 Universe Civilization: Empires at War. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</Link>
              <Link to="/support" className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">Support</Link>
              <Link to="/changelog" className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">Changelog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
