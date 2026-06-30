import { Link } from 'react-router-dom';

export default function TermsPage() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-12">Last Updated: January 2024</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and playing Universe Civilization: Empires at War, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Game Account</h2>
            <p className="leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must be at least 13 years old to create an account</li>
              <li>One account per person is allowed</li>
              <li>Account sharing is prohibited</li>
              <li>You must provide accurate registration information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
            <p className="leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use cheats, exploits, automation software, bots, hacks, or any unauthorized third-party software</li>
              <li>Exploit bugs or glitches for personal gain</li>
              <li>Harass, threaten, or abuse other players</li>
              <li>Use offensive or inappropriate language</li>
              <li>Engage in real-money trading of in-game items or currency</li>
              <li>Impersonate staff members or other players</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Virtual Items and Currency</h2>
            <p className="leading-relaxed">
              All virtual items, currency, and resources in Universe Civilization: Empires at War are owned by the game and licensed to you. You do not own any virtual items, and they have no real-world value. We reserve the right to modify, remove, or add virtual items at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Purchases and Payments</h2>
            <p className="leading-relaxed mb-4">
              All purchases are final and non-refundable except where required by law. Prices are subject to change without notice. We reserve the right to refuse or cancel any purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, features, and functionality of Universe Civilization: Empires at War are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these terms, without prior notice or liability. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              Universe Civilization: Empires at War is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the game, including but not limited to loss of data, loss of virtual items, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our Support page.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line mr-2"></i>Return to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-gray-800 mt-16">
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
