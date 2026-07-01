import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#08080F] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Subtle ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#D4A017] rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `drift ${5 + Math.random() * 5}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Large background text */}
      <h1 className="absolute bottom-0 text-[10rem] md:text-[14rem] font-black text-[#0A0A0D] select-none pointer-events-none z-0 leading-none" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        404
      </h1>

      <div className="relative z-10 max-w-lg">
        <div className="w-16 h-16 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#D4A017]/10">
          <i className="ri-compass-discover-line text-3xl text-[#08080F]"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Sector Not Found
        </h2>
        <p className="text-sm text-[#A09080] font-mono mb-2">
          {location.pathname}
        </p>
        <p className="text-[#908070] mb-8">
          This sector of the galaxy has not yet been charted. The coordinates you requested do not exist in the current universe map.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] font-bold rounded-lg hover:from-[#E8B820] hover:to-[#C9A018] transition-all shadow-lg shadow-[#D4A017]/20 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-home-4-line"></i>
          Return to Imperial Court
        </Link>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}