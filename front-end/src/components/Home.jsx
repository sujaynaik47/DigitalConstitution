import React from 'react';

// --- Icon Component (Placeholder) ---
// Using lucide-react names, represented here by basic symbols for simplicity
const Icon = ({ name, className = "" }) => {
  const icons = {
    users: "👥",
    clipboardList: "🏛️",
    messageSquare: "💬",
    trendingUp: "🔥",
    bookOpen: "📖",
    user: "👤",
    vote:"🗳️",
  };
  return <span className={`text-3xl ${className}`}>{icons[name] || '?'}</span>;
};

// --- Navbar Component ---
const NavBar = () => {
  const links = [
    { name: 'Trending', icon: 'trendingUp', href: '#trending' },
    { name: 'Vote', icon: 'vote', href: '#Vote' },
    { name: 'Posts', icon: 'clipboardList', href: '#Posts' },
    { name: 'My Activity', icon: 'messageSquare', href: '#activity' },
    { name: 'Profile', icon: 'user', href: '#profile' },
  ];
  
  return (
    <header className="bg-blue-800 shadow-2xl sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2 text-white text-xl font-bold">
              <Icon name="bookOpen" className="text-2xl text-orange-400" />
              <span>Digital Platform</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="flex items-center space-x-2 text-white text-sm font-medium px-3 py-2 rounded-lg transition duration-150 hover:bg-blue-700 hover:text-white"
              >
                <Icon name={link.icon} className="text-base" />
                <span>{link.name}</span>
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Icon (Placeholder) */}
          <button className="md:hidden text-white hover:text-gray-200">
             <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Hero Section Component ---
const HeroSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-16 max-w-5xl mx-auto my-12 text-center border-t-4 border-orange-500">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 leading-tight mb-4">
        Shape the Future of Our <span className="text-orange-600">Digital Constitution</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Engage directly with proposed amendments, share your informed opinions, and collaborate with lawmakers and verified experts.
      </p>
      <div className="flex justify-center space-x-4">
        <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 hover:bg-green-700 transform hover:scale-105">
          Start Exploring Amendments
        </button>
        <button className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full border border-blue-800 transition duration-300 hover:bg-blue-50 transform hover:scale-105">
          Read Our Vision
        </button>
      </div>
    </div>
  );
};

// --- Stats Section Component ---
const StatsSection = () => {
  const stats = [
    { label: "Registered Citizens", value: "1.5M+", icon: "users", color: "text-blue-600" },
    { label: "Amendments Under Discussion", value: "42", icon: "clipboardList", color: "text-orange-600" },
    { label: "Total Opinions Submitted", value: "75K+", icon: "messageSquare", color: "text-green-600" },
  ];
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-xl shadow-lg text-center transition duration-300 hover:shadow-2xl border-b-4 border-opacity-70" style={{ borderColor: stat.color.replace('text-', '#').replace('-600', '600') }}>
            <Icon name={stat.icon} className={`mx-auto mb-4 ${stat.color}`} />
            <div className="text-5xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-lg font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        
        {/* About */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Our Mission</a></li>
            <li><a href="#" className="hover:text-white">Lawmaker Access</a></li>
          </ul>
        </div>
        
        {/* Support */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        
        {/* Legal */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
          </ul>
        </div>
        
        {/* Social */}
        <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-lg text-orange-400">Connect</h4>
            <div className="flex space-x-4">
                <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">T</a>
                <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">F</a>
                <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">in</a>
            </div>
            <p className="text-xs pt-4 text-gray-500">
                A non-partisan, government-backed initiative.
            </p>
        </div>

      </div>
      <div className="text-center mt-12 pt-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          © 2025 Digital Constitution Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// --- Main App Component ---
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <NavBar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <HeroSection />
          <StatsSection />

          {/* Featured Content CTA */}
          <div className="bg-blue-900 text-white p-10 rounded-2xl max-w-5xl mx-auto my-12 flex flex-col md:flex-row items-center justify-between shadow-xl border-l-8 border-green-500">
            <div>
              <h3 className="text-3xl font-bold mb-2">
                New: Freedom of Information Act Review
              </h3>
              <p className="text-lg text-blue-200">
                Join the highest-priority discussion this month.
              </p>
            </div>
            <button className="mt-6 md:mt-0 bg-orange-500 text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-orange-600 shadow-md">
              View Details & Comment
            </button>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
