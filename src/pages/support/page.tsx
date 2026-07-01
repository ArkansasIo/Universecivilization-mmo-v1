import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'ri-apps-line' },
    { id: 'account', name: 'Account', icon: 'ri-user-line' },
    { id: 'gameplay', name: 'Gameplay', icon: 'ri-gamepad-line' },
    { id: 'technical', name: 'Technical', icon: 'ri-tools-line' },
    { id: 'payment', name: 'Payment', icon: 'ri-bank-card-line' },
    { id: 'alliance', name: 'Alliance', icon: 'ri-team-line' },
  ];

  const faqs = [
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we will send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      category: 'account',
      question: 'Can I change my username?',
      answer: 'Usernames can be changed once every 30 days. Go to your Profile page and click on "Edit Profile" to change your username. Premium members can change their username more frequently.'
    },
    {
      category: 'gameplay',
      question: 'How do I build ships?',
      answer: 'Visit the Shipyard page from the main navigation. Select the ship type you want to build, ensure you have enough resources, and click "Build". Ships will be added to your fleet once construction is complete.'
    },
    {
      category: 'gameplay',
      question: 'What are the best starting strategies?',
      answer: 'Focus on building Metal and Crystal Mines first to establish a strong resource foundation. Research Energy Technology early. Build a balanced fleet of Fighters and Cruisers. Join an active alliance for protection and guidance.'
    },
    {
      category: 'gameplay',
      question: 'How does combat work?',
      answer: 'Combat is resolved automatically based on ship stats, weapons, defenses, and fleet formations. You can simulate battles in the Combat Simulator before attacking. Research technologies and upgrade ships to improve combat effectiveness.'
    },
    {
      category: 'technical',
      question: 'The game is running slowly. What can I do?',
      answer: 'Try clearing your browser cache and cookies. Close unnecessary browser tabs. Ensure your browser is up to date. Disable browser extensions that might interfere with the game. Check your internet connection speed.'
    },
    {
      category: 'technical',
      question: 'I lost my progress. Can it be recovered?',
      answer: 'Your progress is automatically saved to our servers. Try logging out and logging back in. Clear your browser cache. If the issue persists, contact support with your account details and we will investigate.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, Mastercard, American Express), PayPal, and various regional payment methods. All transactions are processed securely through our payment partners.'
    },
    {
      category: 'payment',
      question: 'Can I get a refund?',
      answer: 'Refunds are handled on a case-by-case basis. If you have not used the purchased items, contact support within 48 hours of purchase. Refunds for used items or after 48 hours are generally not available except where required by law.'
    },
    {
      category: 'alliance',
      question: 'How do I join an alliance?',
      answer: 'Go to the Alliance page and browse available alliances. Click "Apply" on an alliance you want to join. Alliance leaders will review your application. You can also create your own alliance if you meet the requirements.'
    },
    {
      category: 'alliance',
      question: 'What are the benefits of being in an alliance?',
      answer: 'Alliance members can share resources, coordinate attacks, defend each other, participate in alliance wars, access alliance research bonuses, and communicate through alliance chat. Strong alliances dominate the galaxy!'
    },
    {
      category: 'gameplay',
      question: 'How do I colonize new planets?',
      answer: 'Research Colony Ship technology, build a Colony Ship in your Shipyard, and send it to an empty planet slot in the Galaxy view. Each player can control multiple planets to expand their empire.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <h1 className="text-5xl font-black text-white mb-4">Support Center</h1>
        <p className="text-xl text-gray-400 mb-8">How can we help you today?</p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-base"
          />
          <i className="ri-search-line absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"></i>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-mail-line text-cyan-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm mb-4">Get help via email within 24 hours</p>
            <a href="mailto:support@stellardominion.com" className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
              support@stellardominion.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-discord-line text-purple-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Discord Community</h3>
            <p className="text-gray-400 text-sm mb-4">Join our active community</p>
            <a href="https://discord.gg/stellardominion" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
              Join Discord
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-book-line text-green-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Game Guide</h3>
            <p className="text-gray-400 text-sm mb-4">Learn game mechanics and strategies</p>
            <Link to="/game-test" className="text-green-400 hover:text-green-300 transition-colors cursor-pointer">
              View Guide
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-white mb-8">Frequently Asked Questions</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <details key={index} className="bg-white/5 border border-cyan-500/20 rounded-lg p-6 group">
                <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                  <span className="flex items-center">
                    <i className="ri-question-line text-cyan-400 mr-3"></i>
                    {faq.question}
                  </span>
                  <i className="ri-arrow-down-s-line text-gray-400 group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-700 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-12">
              <i className="ri-search-line text-gray-600 text-5xl mb-4"></i>
              <p className="text-gray-400">No results found. Try a different search term or category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-400 mb-6">Our support team is here to assist you</p>
          <a 
            href="mailto:support@stellardominion.com" 
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-mail-send-line mr-2"></i>Contact Support
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
