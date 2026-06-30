import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type React from 'react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      quote: "The depth of empire building here is unmatched. Every decision shapes the fate of your civilization across the stars.",
      author: "Stephen",
      level: "Empire Level 89",
      role: "Grand Strategist",
      avatar: "https://readdy.ai/api/search-image?query=imperial%20space%20commander%20portrait%20with%20golden%20armor%20regal%20bearing%20warm%20amber%20lighting%20classical%20laurel%20wreath%20motif%20science%20fantasy%20character%20design%20noble%20bearing%20against%20cosmic%20nebula&width=240&height=240&seq=testimonial1&orientation=squarish"
    },
    {
      quote: "The alliance diplomacy system creates real politics. We forged an empire that spans three galaxies through strategy, not just firepower.",
      author: "Consul Valeria",
      level: "Empire Level 76",
      role: "Diplomatic Corps",
      avatar: "https://readdy.ai/api/search-image?query=noble%20space%20diplomat%20portrait%20female%20with%20intricate%20gold%20jewelry%20regal%20attire%20warm%20copper%20lighting%20classical%20beauty%20against%20starfield%20background%20renaissance%20space%20fantasy%20art&width=240&height=240&seq=testimonial2&orientation=squarish"
    },
    {
      quote: "From a single colony to commanding armadas. The progression feels earned - every conquest, every alliance, every betrayal shapes history.",
      author: "Warlord Thanos",
      level: "Empire Level 92",
      role: "Fleet Admiral",
      avatar: "https://readdy.ai/api/search-image?query=battle%20hardened%20space%20warlord%20portrait%20with%20battle%20scars%20weathered%20golden%20armor%20intense%20gaze%20warm%20dramatic%20lighting%20against%20nebula%20backdrop%20warlord%20character%20design%20dark%20fantasy%20space%20art&width=240&height=240&seq=testimonial3&orientation=squarish"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);

      const response = await fetch('https://readdy.ai/api/form/d55it9vq1d2qkrs09ebg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        setSubmitMessage('Welcome to the empire. Check your inbox for updates.');
        setEmail('');
      } else {
        setSubmitMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080F] text-[#E8E0D5]">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-[#1A1008] via-[#1F140A] to-[#1A1008] border-b border-[#B8860B]/20">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-wrap items-center justify-between text-xs">
            <div className="flex items-center space-x-4 md:space-x-6">
              <span className="text-[#A09080]">
                <span className="text-[#D4A017] font-semibold">Developer:</span> Empire Forge Studios
              </span>
              <span className="text-[#A09080] hidden sm:inline">
                <span className="text-[#D4A017] font-semibold">Lead Designer:</span> Stephen
              </span>
              <span className="text-[#A09080] hidden sm:inline">
                <span className="text-[#D4A017] font-semibold">Version:</span> v3.0.0 Dominion
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/terms" className="text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer">Terms</Link>
              <span className="text-[#3D3025]">|</span>
              <Link to="/privacy" className="text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer">Privacy</Link>
              <span className="text-[#3D3025]">|</span>
              <Link to="/support" className="text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer">Support</Link>
              <span className="text-[#3D3025]">|</span>
              <Link to="/changelog" className="text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer">Changelog</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#08080F]/90 backdrop-blur-xl border-b border-[#B8860B]/20 shadow-lg shadow-[#D4A017]/5' : 'bg-transparent'}`} style={{ marginTop: scrolled ? '0' : '32px' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-12 h-12 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#D4A017]/10 rounded-full blur-md group-hover:bg-[#D4A017]/20 transition-all"></div>
                <i className="ri-vip-crown-line text-3xl text-[#D4A017]"></i>
              </div>
              <div>
                <span className="text-xl font-bold text-[#D4A017] tracking-wider block leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>UNIVERSE</span>
                <span className="text-xs text-[#A09080] tracking-[0.3em] uppercase block leading-tight">Civilization</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Empire</a>
              <a href="#warfare" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Warfare</a>
              <a href="#civilization" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Civilization</a>
              <a href="#universe" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Universe</a>
              <Link to="/cosmic-hierarchy" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Hierarchy</Link>
              <Link to="/races-explorer" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Races</Link>
              <a href="#team" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Team</a>
              <a href="#roadmap" className="text-sm uppercase tracking-wider text-[#A09080] hover:text-[#D4A017] transition-colors cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif' }}>Roadmap</a>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="px-6 py-2 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] rounded-full hover:from-[#E8B820] hover:to-[#C9A018] transition-all whitespace-nowrap cursor-pointer text-sm font-semibold shadow-lg shadow-[#D4A017]/30">
                    Enter Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-red-500/40 text-red-400 rounded-full hover:bg-red-500/10 transition-all whitespace-nowrap cursor-pointer text-sm"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login?demo=true" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-400 hover:to-teal-500 transition-all whitespace-nowrap cursor-pointer text-sm font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
                    <i className="ri-rocket-2-line"></i>
                    Instant Demo
                  </Link>
                  <Link to="/login" className="px-6 py-2 border border-[#B8860B] text-[#D4A017] rounded-full hover:bg-[#D4A017]/10 transition-all whitespace-nowrap cursor-pointer text-sm">
                    Log In
                  </Link>
                  <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] rounded-full hover:from-[#E8B820] hover:to-[#C9A018] transition-all whitespace-nowrap cursor-pointer text-sm font-semibold shadow-lg shadow-[#D4A017]/30">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=epic%20cosmic%20panorama%20with%20warm%20golden%20amber%20nebula%20clouds%20ancient%20empire%20ruins%20floating%20citadels%20majestic%20brass%20copper%20celestial%20structures%20in%20deep%20space%20dramatic%20starlight%20streaming%20through%20colossal%20archways%20civilization%20architecture%20fantasy%20space%20art%20ultra%20wide%20cinematic&width=1920&height=1080&seq=hero1&orientation=landscape" alt="Galactic Empire Civilization" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080F]/70 via-[#08080F]/30 to-[#08080F]/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4A017]/5 via-transparent to-[#B8860B]/5"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#D4A017] rounded-full opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `drift ${3 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <div className="mb-4 inline-block">
              <span className="text-xs tracking-[0.5em] uppercase text-[#D4A017]/80 border border-[#D4A017]/30 px-4 py-2 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Empires at War
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-8" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="block text-[#E8E0D5]" style={{ textShadow: '0 0 40px rgba(212, 160, 23, 0.3)' }}>Forge Your</span>
              <span className="block" style={{
                background: 'linear-gradient(180deg, #F0D060 0%, #D4A017 40%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(212,160,23,0.4))'
              }}>Civilization</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A09080] mb-12 font-light max-w-2xl leading-relaxed">
              Rise from a single world to command vast armadas across the stars. Build, conquer, and rule in a universe where every empire tells a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="group px-10 py-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] text-lg font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-[#D4A017]/30 whitespace-nowrap cursor-pointer inline-flex items-center space-x-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span>ENTER THE UNIVERSE</span>
                    <i className="ri-arrow-right-line text-2xl group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group px-10 py-4 border-2 border-red-500/50 text-red-400 text-lg font-bold rounded-full hover:bg-red-500/10 hover:border-red-500 transition-all whitespace-nowrap cursor-pointer inline-flex items-center space-x-3"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    <span>LOG OUT</span>
                    <i className="ri-logout-box-r-line text-2xl group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="group px-10 py-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] text-lg font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-[#D4A017]/30 whitespace-nowrap cursor-pointer inline-flex items-center space-x-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span>ACCESS COMMAND</span>
                    <i className="ri-arrow-right-line text-2xl group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                  <Link to="/login?demo=true" className="group px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 whitespace-nowrap cursor-pointer inline-flex items-center space-x-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span>INSTANT DEMO</span>
                    <i className="ri-rocket-2-line text-2xl group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                </>
              )}
              <a href="#features" className="group px-10 py-4 border-2 border-[#D4A017]/50 text-[#D4A017] text-lg font-bold rounded-full hover:bg-[#D4A017]/10 hover:border-[#D4A017] transition-all whitespace-nowrap cursor-pointer inline-flex items-center space-x-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <span>EXPLORE</span>
                <i className="ri-arrow-down-line text-2xl group-hover:translate-y-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-4xl text-[#D4A017]"></i>
        </div>
      </section>

      {/* Empire Pillars Section */}
      <section id="features" className="relative py-32 bg-[#08080F] overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.05) 0%, transparent 60%)',
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>The Pillars of Empire</p>
            <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Build Your <span className="text-[#D4A017]">Dominion</span>
            </h2>
            <p className="text-[#A09080] max-w-2xl mx-auto leading-relaxed">Every great civilization stands on three pillars. Master them all, and the universe kneels before your throne.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-10 hover:border-[#D4A017]/60 transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/5 rounded-full blur-3xl group-hover:bg-[#D4A017]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A017]/20 to-[#B8860B]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className="ri-sword-line text-3xl text-[#D4A017]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#E8E0D5] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>Military Might</h3>
                <p className="text-[#908070] leading-relaxed mb-6">Command vast armadas of specialized warships. From nimble corvettes to planet-cracking dreadnoughts, deploy tactical formations and unleash devastating coordinated strikes. Real-time combat resolves every engagement with brutal precision.</p>
                <ul className="space-y-3 text-sm text-[#A09080]">
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>6 ship classes with unique abilities</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Dynamic combat simulation</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Fleet formation tactics</li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-10 hover:border-[#D4A017]/60 transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/5 rounded-full blur-3xl group-hover:bg-[#D4A017]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A017]/20 to-[#B8860B]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className="ri-copper-coin-line text-3xl text-[#D4A017]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#E8E0D5] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>Economic Power</h3>
                <p className="text-[#908070] leading-relaxed mb-6">Master resource extraction across hundreds of planets. Mine precious metals, harvest rare crystals, and refine deuterium fuel. Build sprawling trade networks and manipulate galactic markets to fund your war machine.</p>
                <ul className="space-y-3 text-sm text-[#A09080]">
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>3 core resources + rare materials</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Player-driven marketplace</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Trade route automation</li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-10 hover:border-[#D4A017]/60 transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/5 rounded-full blur-3xl group-hover:bg-[#D4A017]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A017]/20 to-[#B8860B]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className="ri-global-line text-3xl text-[#D4A017]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#E8E0D5] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>Diplomatic Mastery</h3>
                <p className="text-[#908070] leading-relaxed mb-6">Forge alliances, negotiate treaties, and wage shadow wars through espionage. Deploy spies to infiltrate enemy empires, broker peace between warring factions, or betray your allies at the perfect moment. Politics is warfare by other means.</p>
                <ul className="space-y-3 text-sm text-[#A09080]">
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Alliance politics and treaties</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Deep espionage system</li>
                  <li className="flex items-center gap-2"><i className="ri-checkbox-circle-fill text-[#D4A017] text-lg"></i>Galactic council politics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Systems of the Empire */}
      <section className="relative py-24 bg-[#0A0A0E] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div style={{
            backgroundImage: 'radial-gradient(circle at 15% 25%, rgba(212,160,23,0.04) 1px, transparent 1px), radial-gradient(circle at 85% 75%, rgba(184,134,11,0.03) 1px, transparent 1px)',
            backgroundSize: '100px 100px, 80px 80px',
            width: '100%', height: '100%'
          }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>The Machinery of War</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#E8E0D5] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Systems of the <span className="text-[#D4A017]">Empire</span>
            </h2>
            <p className="text-[#908070] max-w-2xl mx-auto leading-relaxed">Every commander must master these domains. From fleet logistics to deep-space research, your empire's strength lies in how well you wield every tool at your disposal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: 'ri-rocket-2-line',
                title: 'Fleet Command',
                desc: 'Construct and command 6 distinct ship classes. Design fleet formations, launch expeditions, and coordinate ACS joint attacks. Every vessel serves a purpose in your grand strategy.',
                stat: '40+ Ship Types',
                color: '#f87171'
              },
              {
                icon: 'ri-flask-line',
                title: 'Research & Tech',
                desc: 'Unlock 100+ technologies across weaponry, propulsion, shielding, and exotic sciences. Advanced Research branches into specialized trees that reshape your empire capabilities.',
                stat: '100+ Techs',
                color: '#a78bfa'
              },
              {
                icon: 'ri-hammer-line',
                title: 'Crafting',
                desc: 'Forge legendary equipment, augmentations, and artifacts through the Master Crafting system. Rank up your crafting skills across Alchemy, Engineering, Weaponsmithing, and Nanotech trees.',
                stat: '50+ Recipes',
                color: '#fb923c'
              },
              {
                icon: 'ri-shield-star-line',
                title: 'Alliances',
                desc: 'Form or join alliances, negotiate treaties, wage alliance wars, and manage diplomatic relations. The diplomacy map shows the real political landscape of your universe.',
                stat: 'Full Diplomacy',
                color: '#fbbf24'
              },
              {
                icon: 'ri-building-2-line',
                title: 'Colonies & Buildings',
                desc: 'Expand across planets and moons. Construct mines, shipyards, research labs, defense grids, and megastructures. Each world offers unique bonuses and strategic positioning.',
                stat: '30+ Structures',
                color: '#5bc0be'
              },
              {
                icon: 'ri-store-2-line',
                title: 'Market & Trade',
                desc: 'Buy and sell resources on the player-driven marketplace. Establish automated trade routes, participate in auctions, or risk the Black Market for rare contraband.',
                stat: 'Live Economy',
                color: '#4ade80'
              },
              {
                icon: 'ri-user-star-line',
                title: 'Officers & Skills',
                desc: 'Recruit elite officers with unique abilities. Train military and civilian units. The skill system lets you specialize your empire in combat, economy, or espionage.',
                stat: 'Officer System',
                color: '#e2c044'
              },
              {
                icon: 'ri-skull-line',
                title: 'World Bosses & Events',
                desc: 'Coordinate with thousands of players to defeat galactic world bosses. Seasonal events, seasonal passes, and limited-time campaigns keep the universe dynamic and rewarding.',
                stat: 'Seasonal Content',
                color: '#f472b6'
              },
            ].map((sys, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/15 rounded-xl p-6 hover:border-[#D4A017]/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${sys.color}15` }}>
                    <i className={`${sys.icon} text-lg`} style={{ color: sys.color }}></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#E8E0D5]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{sys.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: sys.color }}>{sys.stat}</span>
                  </div>
                </div>
                <p className="text-sm text-[#908070] leading-relaxed">{sys.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/races-explorer" className="inline-flex items-center gap-2 px-6 py-3 border border-[#B8860B]/30 rounded-full text-sm text-[#D4A017] hover:bg-[#D4A017]/10 hover:border-[#D4A017]/50 transition-all cursor-pointer">
              <i className="ri-compass-3-line"></i>
              Explore the Galactic Race Registry
            </Link>
          </div>
        </div>
      </section>

      {/* Warfare Section */}
      <section id="warfare" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=epic%20space%20battle%20scene%20with%20massive%20warship%20formations%20exchanging%20golden%20plasma%20fire%20dramatic%20cosmic%20warfare%20ancient%20empire%20styled%20vessels%20brass%20copper%20armor%20plating%20explosions%20illuminating%20dark%20nebula%20background%20cinematic%20war%20art&width=1920&height=1080&seq=warfare1&orientation=landscape" alt="Epic Space Battle" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080F] via-[#08080F]/80 to-[#08080F]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>The Art of War</p>
              <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-8 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Conquest <span className="text-[#D4A017]">Redefined</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-crosshair-line text-xl text-[#D4A017]"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#E8E0D5] mb-2">Real-Time Combat Engine</h4>
                    <p className="text-[#908070] leading-relaxed">Watch your fleets engage in spectacular real-time battles. Advanced algorithms calculate every shot, every shield impact, every hull breach based on ship class, technology level, and tactical positioning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-radar-line text-xl text-[#D4A017]"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#E8E0D5] mb-2">Espionage and Intelligence</h4>
                    <p className="text-[#908070] leading-relaxed">Knowledge is power. Deploy spy probes to reveal enemy fleet compositions, defensive structures, and resource stockpiles. Counter-intelligence operations protect your own secrets from prying eyes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-fire-line text-xl text-[#D4A017]"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#E8E0D5] mb-2">Salvage and War Spoils</h4>
                    <p className="text-[#908070] leading-relaxed">Victory leaves debris fields rich with resources. Harvest the remains of destroyed fleets to fuel your expansion. Every battle is an investment - win, and you grow stronger.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border-2 border-[#B8860B]/40 shadow-2xl shadow-[#D4A017]/10">
                <img src="https://readdy.ai/api/search-image?query=futuristic%20warfare%20command%20interface%20with%20golden%20holographic%20tactical%20displays%20showing%20fleet%20movements%20battle%20formations%20resource%20counters%20damage%20reports%20ornate%20imperial%20UI%20design%20brass%20framework%20warm%20lighting%20strategy%20game%20dashboard&width=700&height=500&seq=warfare-ui&orientation=landscape" alt="Warfare Command Interface" className="w-full object-cover object-top" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#111108] border border-[#B8860B]/30 rounded-xl p-4 shadow-xl">
                <p className="text-xs text-[#D4A017] uppercase tracking-wider mb-1">Active Battles</p>
                <p className="text-2xl font-bold text-[#E8E0D5]" style={{ fontFamily: 'Orbitron, sans-serif' }}>12,847</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-[#111108] border border-[#B8860B]/30 rounded-xl p-4 shadow-xl">
                <p className="text-xs text-[#D4A017] uppercase tracking-wider mb-1">Ships Destroyed Today</p>
                <p className="text-2xl font-bold text-[#E8E0D5]" style={{ fontFamily: 'Orbitron, sans-serif' }}>2.4M</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Civilization Building Section */}
      <section id="civilization" className="relative py-32 bg-[#0D0C08] overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 70%, rgba(212,160,23,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(184,134,11,0.04) 0%, transparent 50%)',
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>From Dust to Dominion</p>
            <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Build Your <span className="text-[#D4A017]">Civilization</span>
            </h2>
            <p className="text-[#A09080] max-w-2xl mx-auto leading-relaxed">Every great empire begins with a single colony. Expand, research, and prosper.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-8 hover:border-[#D4A017]/40 transition-all cursor-pointer group">
              <div className="rounded-xl overflow-hidden mb-6">
                <img src="https://readdy.ai/api/search-image?query=futuristic%20planet%20colony%20with%20golden%20domed%20structures%20terraformed%20landscape%20brass%20metallic%20buildings%20warm%20sunlight%20over%20alien%20world%20civilization%20settlement%20sci-fi%20concept%20art%20atmospheric&width=600&height=300&seq=colony1&orientation=landscape" alt="Planet Colony" className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>Colony Management</h3>
              <p className="text-[#908070] leading-relaxed">Expand across star systems. Each planet offers unique resource bonuses and strategic value. Balance infrastructure, defense, and population growth across your growing empire.</p>
            </div>
            <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-8 hover:border-[#D4A017]/40 transition-all cursor-pointer group">
              <div className="rounded-xl overflow-hidden mb-6">
                <img src="https://readdy.ai/api/search-image?query=ancient%20futuristic%20research%20laboratory%20with%20holographic%20technology%20trees%20golden%20light%20emanating%20from%20crystalline%20data%20cores%20brass%20scientific%20instruments%20warm%20amber%20glow%20mysterious%20knowledge%20repository%20fantasy%20science%20concept&width=600&height=300&seq=research1&orientation=landscape" alt="Research Technology" className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>Technology Trees</h3>
              <p className="text-[#908070] leading-relaxed">Unlock ancient and futuristic technologies. Weapons, shields, engines, and exotic abilities await discovery. Each research path shapes your empire's destiny.</p>
            </div>
            <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-8 hover:border-[#D4A017]/40 transition-all cursor-pointer group">
              <div className="rounded-xl overflow-hidden mb-6">
                <img src="https://readdy.ai/api/search-image?query=massive%20space%20construction%20yard%20with%20ships%20being%20assembled%20golden%20scaffolding%20brass%20industrial%20structures%20orbital%20shipyard%20warm%20cosmic%20lighting%20epic%20scale%20engineering%20futuristic%20civilization%20building%20concept&width=600&height=300&seq=infra1&orientation=landscape" alt="Space Infrastructure" className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>Infrastructure</h3>
              <p className="text-[#908070] leading-relaxed">Construct mines, shipyards, research labs, and defense grids. Upgrade facilities to unlock new capabilities. Efficient infrastructure is the backbone of any galactic superpower.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Universe Section */}
      <section id="universe" className="relative py-32 bg-[#08080F] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,160,23,0.03) 2px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(184,134,11,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px, 60px 60px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden border-2 border-[#B8860B]/20">
                <img src="https://readdy.ai/api/search-image?query=vast%20cosmic%20galaxy%20map%20with%20golden%20constellation%20lines%20connecting%20star%20systems%20nebula%20regions%20highlighted%20in%20warm%20amber%20tones%20brass%20celestial%20navigation%20markers%20ancient%20astronomical%20chart%20style%20mixed%20with%20futuristic%20holographic%20elements%20deep%20space%20cartography&width=700&height=500&seq=universe1&orientation=landscape" alt="Galaxy Universe Map" className="w-full object-cover object-top" />
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>The Grand Stage</p>
              <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-8 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                30 <span className="text-[#D4A017]">Universes</span><br />300 Realms
              </h2>
              <p className="text-[#A09080] leading-relaxed mb-8 text-lg">Your civilization spans multiple universes, each containing countless star systems. Explore uncharted territories, discover ancient artifacts, and carve your name into the fabric of the cosmos.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#111108] rounded-xl p-6 border border-[#B8860B]/10">
                  <p className="text-3xl font-bold text-[#D4A017] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>50K+</p>
                  <p className="text-sm text-[#908070]">Active Commanders</p>
                </div>
                <div className="bg-[#111108] rounded-xl p-6 border border-[#B8860B]/10">
                  <p className="text-3xl font-bold text-[#D4A017] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>1,200+</p>
                  <p className="text-sm text-[#908070]">Active Alliances</p>
                </div>
                <div className="bg-[#111108] rounded-xl p-6 border border-[#B8860B]/10">
                  <p className="text-3xl font-bold text-[#D4A017] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>8.4M</p>
                  <p className="text-sm text-[#908070]">Planets Colonized</p>
                </div>
                <div className="bg-[#111108] rounded-xl p-6 border border-[#B8860B]/10">
                  <p className="text-3xl font-bold text-[#D4A017] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>340K</p>
                  <p className="text-sm text-[#908070]">Daily Battles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="relative py-32 bg-[#0D0C08] overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(212,160,23,0.03) 0%, transparent 50%, rgba(184,134,11,0.03) 100%)',
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>The March of Time</p>
            <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Roadmap to <span className="italic text-[#D4A017]">Greatness</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                phase: 'I',
                title: 'Foundation',
                date: 'Q2 2024',
                items: ['Core game engine', 'Resource system', 'Planet colonization', 'Fleet construction', 'Combat mechanics', 'Player accounts'],
                status: 'launched'
              },
              {
                phase: 'II',
                title: 'Conquest',
                date: 'Q3 2024',
                items: ['Alliance system', 'Advanced research', 'Espionage network', 'Marketplace trading', 'Global rankings', 'Mobile support'],
                status: 'launched'
              },
              {
                phase: 'III',
                title: 'Dominion',
                date: 'Q4 2024',
                items: ['Public release', 'Tutorial system', 'Achievements', 'Galactic events', 'Premium features', 'Community hub'],
                status: 'active'
              },
              {
                phase: 'IV',
                title: 'Legacy',
                date: 'Q1 2025',
                items: ['New ship classes', 'Universe expansion', 'World bosses', 'Advanced AI', 'Seasonal content', 'Cross-server wars'],
                status: 'upcoming'
              }
            ].map((phase, idx) => (
              <div key={idx} className={`bg-gradient-to-b from-[#111108] to-[#0D0C07] rounded-2xl p-8 border transition-all cursor-pointer ${phase.status === 'active' ? 'border-[#D4A017]/60 shadow-lg shadow-[#D4A017]/10' : 'border-[#B8860B]/20 hover:border-[#D4A017]/40'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#D4A017] to-[#D4A017]/20" style={{ WebkitTextStroke: '1px #D4A017', fontFamily: 'Orbitron, sans-serif' }}>{phase.phase}</span>
                  {phase.status === 'active' && (
                    <span className="px-3 py-1 bg-[#D4A017]/20 text-[#D4A017] text-xs rounded-full animate-pulse">In Progress</span>
                  )}
                  {phase.status === 'upcoming' && (
                    <span className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] text-xs rounded-full">Upcoming</span>
                  )}
                  {phase.status === 'launched' && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Launched</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>{phase.title}</h3>
                <p className="text-xs text-[#D4A017] mb-6">{phase.date}</p>
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#908070]">
                      <i className="ri-checkbox-circle-fill text-[#D4A017] mt-0.5 flex-shrink-0"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dev Team Section */}
      <section id="team" className="relative py-32 bg-[#08080F] overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 60%)',
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>The Architects</p>
            <h2 className="text-5xl md:text-6xl font-bold text-[#E8E0D5] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Development <span className="text-[#D4A017]">Team</span>
            </h2>
            <p className="text-[#A09080] max-w-xl mx-auto leading-relaxed">The minds behind the empire. Passionate builders crafting the ultimate civilization experience.</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 hover:border-[#D4A017]/60 rounded-2xl p-10 max-w-md w-full transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4A017]/5 rounded-full blur-3xl group-hover:bg-[#D4A017]/10 transition-all"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#B8860B]/5 rounded-full blur-3xl group-hover:bg-[#B8860B]/8 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-[3px] border-[#D4A017]/60 shadow-2xl shadow-[#D4A017]/20 group-hover:border-[#D4A017] transition-all">
                    <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#B8860B]/40 m-[5px]">
                      <img src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20focused%20game%20designer%20with%20a%20warm%20determined%20expression%20subtle%20golden%20ambient%20lighting%20dark%20atmospheric%20background%20creative%20visionary%20character%20art%20with%20slight%20stubble%20wearing%20casual%20dark%20attire&width=288&height=288&seq=stephen-team&orientation=squarish" alt="Stephen" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#D4A017] text-[#08080F] px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg">
                    Lead Designer
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>Stephen</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-green-400">Building the empire</span>
                </div>
                <p className="text-[#908070] leading-relaxed mb-6 text-sm max-w-xs">Visionary behind the Universe Civilization experience. Crafting every system, every battle, and every story that unfolds across the stars.</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#B8860B]/10 w-full justify-center">
                  <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                    <i className="ri-github-line text-lg"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                    <i className="ri-twitter-x-line text-lg"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                    <i className="ri-linkedin-box-line text-lg"></i>
                  </a>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full">
                  <div className="bg-[#D4A017]/5 rounded-xl p-3">
                    <p className="text-lg font-bold text-[#D4A017]" style={{ fontFamily: 'Orbitron, sans-serif' }}>4+</p>
                    <p className="text-[10px] text-[#A09080] uppercase tracking-wider">Years Building</p>
                  </div>
                  <div className="bg-[#D4A017]/5 rounded-xl p-3">
                    <p className="text-lg font-bold text-[#D4A017]" style={{ fontFamily: 'Orbitron, sans-serif' }}>300+</p>
                    <p className="text-[10px] text-[#A09080] uppercase tracking-wider">Features</p>
                  </div>
                  <div className="bg-[#D4A017]/5 rounded-xl p-3">
                    <p className="text-lg font-bold text-[#D4A017]" style={{ fontFamily: 'Orbitron, sans-serif' }}>∞</p>
                    <p className="text-[10px] text-[#A09080] uppercase tracking-wider">Ambition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#08080F] to-[#0D0C08]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>Testimonials</p>
            <h2 className="text-5xl font-bold text-[#E8E0D5]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Voices of the <span className="text-[#D4A017]">Empire</span></h2>
          </div>
          <div className="bg-gradient-to-b from-[#111108] to-[#0A0A06] backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#B8860B]/20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-[3px] border-[#D4A017]/60 shadow-2xl shadow-[#D4A017]/20">
                    <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#B8860B]/40 m-[6px]">
                      <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].author} className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#D4A017] text-[#08080F] px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {testimonials[activeTestimonial].author}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <p className="text-xs uppercase tracking-widest text-[#D4A017] mb-6">Player Testimony</p>
                <p className="text-xl md:text-3xl font-light text-[#E8E0D5] leading-relaxed mb-8 italic">
                  <span className="text-5xl text-[#D4A017]" style={{ fontFamily: 'Orbitron, sans-serif' }}>&ldquo;</span>
                  {testimonials[activeTestimonial].quote}
                  <span className="text-5xl text-[#D4A017]" style={{ fontFamily: 'Orbitron, sans-serif' }}>&rdquo;</span>
                </p>
                <div className="flex space-x-3">
                  <span className="px-4 py-2 bg-[#D4A017]/10 text-[#D4A017] text-sm rounded-full">{testimonials[activeTestimonial].level}</span>
                  <span className="px-4 py-2 bg-[#B8860B]/10 text-[#B8860B] text-sm rounded-full">{testimonials[activeTestimonial].role}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button onClick={prevTestimonial} className="w-10 h-10 md:w-12 md:h-12 border border-[#B8860B]/40 rounded-full flex items-center justify-center hover:border-[#D4A017] hover:text-[#D4A017] transition-all cursor-pointer text-[#A09080]">
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === activeTestimonial ? 'bg-[#D4A017] w-6' : 'bg-[#B8860B]/30 hover:bg-[#B8860B]/60'}`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} className="w-10 h-10 md:w-12 md:h-12 bg-[#D4A017] rounded-full flex items-center justify-center hover:bg-[#E8B820] transition-all cursor-pointer">
                <i className="ri-arrow-right-line text-xl text-[#08080F]"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=majestic%20golden%20imperial%20throne%20room%20floating%20in%20space%20cosmic%20background%20with%20warm%20amber%20starlight%20streaming%20through%20colossal%20brass%20pillars%20ancient%20civilization%20architecture%20celestial%20cathedral%20vast%20galaxies%20visible%20through%20grand%20archways%20epic%20fantasy%20space%20art&width=1920&height=1080&seq=cta1&orientation=landscape" alt="Imperial Throne Room" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080F]/80 via-[#08080F]/40 to-[#08080F]/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-[#E8E0D5] mb-4 leading-none" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Claim Your<br /><span className="text-[#D4A017]">Throne</span>
              </h2>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-xl md:text-2xl font-light text-[#E8E0D5] mb-2">Millions of commanders are waiting</p>
              <p className="text-xl md:text-2xl font-light text-[#D4A017] mb-10" style={{ fontFamily: 'Orbitron, sans-serif' }}>Your empire begins now</p>
              {user ? (
                <Link to="/dashboard" className="group px-12 py-5 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] text-xl font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-[#D4A017]/30 whitespace-nowrap cursor-pointer inline-flex items-center space-x-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <span>ENTER THE UNIVERSE</span>
                  <div className="w-10 h-10 bg-[#08080F]/20 rounded-full flex items-center justify-center">
                    <i className="ri-vip-crown-line text-2xl"></i>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/register" className="group px-12 py-5 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] text-xl font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-[#D4A017]/30 whitespace-nowrap cursor-pointer inline-flex items-center space-x-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span>CLAIM YOUR THRONE</span>
                    <div className="w-10 h-10 bg-[#08080F]/20 rounded-full flex items-center justify-center">
                      <i className="ri-vip-crown-line text-2xl"></i>
                    </div>
                  </Link>
                  <Link to="/login?demo=true" className="group px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 whitespace-nowrap cursor-pointer inline-flex items-center space-x-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span>INSTANT DEMO</span>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="ri-rocket-2-line text-2xl"></i>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060608] m-4 md:m-10 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[#B8860B]/10">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[80px] md:text-[140px] font-black text-[#0A0A0D] select-none pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Orbitron, sans-serif' }}>EMPIRE</div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4A017]/20 to-[#B8860B]/10 rounded-full flex items-center justify-center">
                <i className="ri-vip-crown-line text-2xl text-[#D4A017]"></i>
              </div>
              <div>
                <span className="text-lg font-bold text-[#D4A017] tracking-wider block leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>UNIVERSE</span>
                <span className="text-[10px] text-[#A09080] tracking-[0.3em] uppercase block leading-tight">Civilization</span>
              </div>
            </div>
            <p className="text-sm text-[#908070] mb-6">Rise. Conquer. Reign.</p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                <i className="ri-discord-line text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                <i className="ri-reddit-line text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#D4A017]/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] hover:text-[#08080F] transition-all cursor-pointer text-[#D4A017]">
                <i className="ri-youtube-line text-lg"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>Empire</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Pillars</a></li>
              <li><a href="#warfare" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Warfare</a></li>
              <li><a href="#universe" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Universe</a></li>
              <li><Link to="/cosmic-hierarchy" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Cosmic Hierarchy</Link></li>
              <li><Link to="/races-explorer" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Galactic Race Registry</Link></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Alliances</a></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Leaderboard</a></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Codex</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-[#D4A017] mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>Community</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Forums</a></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Discord</a></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Events</a></li>
              <li><Link to="/support" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Support</Link></li>
              <li><a href="#" className="text-sm text-[#908070] hover:text-[#D4A017] transition-colors cursor-pointer">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm text-[#E8E0D5] mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>Imperial Dispatch</h4>
            <p className="text-sm text-[#908070] mb-4">Receive battle reports and empire updates</p>
            <form id="newsletter-form" data-readdy-form onSubmit={handleNewsletterSubmit} className="mb-3">
              <div className="flex">
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  className="flex-1 px-4 py-3 bg-[#0D0C08] border border-[#B8860B]/30 rounded-l-full text-[#E8E0D5] text-sm focus:outline-none focus:border-[#D4A017] placeholder-[#605040]" 
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-12 h-12 bg-[#D4A017] rounded-full flex items-center justify-center hover:bg-[#E8B820] transition-all -ml-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <i className="ri-loader-4-line text-lg text-[#08080F] animate-spin"></i>
                  ) : (
                    <i className="ri-arrow-right-line text-lg text-[#08080F]"></i>
                  )}
                </button>
              </div>
            </form>
            {submitMessage && (
              <p className={`text-xs ${submitMessage.includes('Welcome') ? 'text-green-400' : 'text-red-400'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>
        <div className="relative z-10 mt-12 pt-8 border-t border-[#B8860B]/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#605040] text-sm mb-4 md:mb-0">&copy; 2026 Universe Civilization: Empires at War. All rights reserved.</p>
          <a href="https://readdy.ai/?origin=logo" target="_blank" rel="noopener noreferrer" className="text-[#605040] hover:text-[#D4A017] text-sm transition-colors cursor-pointer">Powered by Readdy</a>
        </div>
      </footer>

      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}