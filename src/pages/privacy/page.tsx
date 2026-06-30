import { Link } from 'react-router-dom';

export default function PrivacyPage() {
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
        <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Last Updated: January 2024</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information that you provide directly to us when you create an account and play Universe Civilization: Empires at War:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Account Information:</strong> Email address, username, password</li>
              <li><strong className="text-white">Game Data:</strong> Progress, achievements, resources, fleet compositions, research levels</li>
              <li><strong className="text-white">Communication Data:</strong> In-game messages, alliance chat, support tickets</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information, gameplay statistics</li>
              <li><strong className="text-white">Payment Information:</strong> Transaction history (payment details are processed by third-party providers)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the collected information for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Providing and maintaining the game service</li>
              <li>Processing transactions and managing your account</li>
              <li>Improving game features and user experience</li>
              <li>Communicating with you about updates, events, and promotions</li>
              <li>Detecting and preventing cheating, fraud, and abuse</li>
              <li>Analyzing game performance and player behavior</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Service Providers:</strong> Third-party companies that help us operate the game (hosting, analytics, payment processing)</li>
              <li><strong className="text-white">Other Players:</strong> Your username, alliance membership, and public game statistics are visible to other players</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We use encryption, secure servers, and regular security audits to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your account and data</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookies through your browser settings, but disabling them may affect game functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              Universe Civilization: Empires at War is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected such information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice in the game or sending you an email. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy or wish to exercise your rights, please contact us through our Support page.
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
