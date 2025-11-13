// //Home.jsx

import React, { useState, useEffect, useRef } from 'react'; // <-- Added useRef
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Main Application Pages ---
import TrendingPosts from "./TrendingPosts";
import MyActivity from "./MyActivity";
import ProfileView from "./ProfileView";
import Vote from "./Vote";
import PostsList from "./PostsList";
import ConstitutionPage from "./ConstitutionPage"; 

// --- Footer Destination Imports ---
import Footer from './Footer';
// (other page imports)
import AboutUsPage from './AboutUsPage';
import OurMissionPage from './OurMissionPage';
import LawmakerLoginPage from './LawmakerLoginPage';
import HelpCenterPage from './HelpCenterPage'; 
import ContactUsPage from './ContactUsPage';
import TermsOfServicePage from './legal/TermsOfServicePage';
import PrivacyPolicyPage from './legal/PrivacyPolicyPage';
import SecurityPage from './legal/SecurityPage';
import Chatbot from "./chatbot";


// --- (All your components like Icon, PostsDisplay, ActivitySection, NavBar, HeroSection, StatsSection, HomePage are here... no changes needed in them) ---
const Icon = ({ name, className = "" }) => {
  const icons = {
    users: "👥",
    clipboardList: "🏛️",
    messageSquare: "💬",
    trendingUp: "🔥",
    bookOpen: "📖",
    user: "👤",
    vote: "🗳️",
  };
  return <span className={`text-3xl ${className}`}>{icons[name] || '?'}</span>;
};
const PostsDisplay = ({ posts, type }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No posts found in {type}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 my-6">
      {/* ... posts map ... */}
    </div>
  );
};
const ActivitySection = ({ type }) => {
  // ... fetch logic ...
  return <PostsDisplay posts={[]} type={type === 'my-activity' ? 'My Activity' : 'Trending'} />;
};
const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('/');
  
  const links = [
    { name: 'Trending', icon: 'trendingUp', path: '/trending' },
    { name: 'Vote', icon: 'vote', path: '/vote' },
    { name: 'Posts', icon: 'clipboardList', path: '/posts' },
    { name: 'Read Constitution', icon: 'bookOpen', path: '/constitution' },
    { name: 'My Activity', icon: 'messageSquare', path: '/my-activity' },
    { name: 'Profile', icon: 'user', path: '/profile' },
  ];

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <header className="bg-blue-800 shadow-2xl sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 text-white text-xl font-bold"
            >
              <Icon name="bookOpen" className="text-2xl text-orange-400" />
              <span>Digital Constitution Forum</span>
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center space-x-2 text-white text-sm font-medium px-3 py-2 rounded-lg transition duration-150 hover:bg-blue-700 hover:text-white ${
                  currentPath === link.path ? 'bg-blue-700' : ''
                }`}
              >
                <Icon name={link.icon} className="text-base" />
                <span>{link.name}</span>
              </button>
            ))}
            {user && (
              <button
                onClick={onLogout}
                className="text-white text-sm font-medium px-3 py-2 rounded-lg transition duration-150 hover:bg-blue-700"
              >
                Logout
              </button>
            )}
          </nav>
          
          <button className="md:hidden text-white hover:text-gray-200">
              <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};
const HeroSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-16 max-w-5xl mx-auto my-12 text-center border-t-4 border-orange-500">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 leading-tight mb-4">
        Shape the Future of Our <span className="text-orange-600">Digital Constitution</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Engage directly with proposed amendments, share your informed posts, and collaborate with lawmakers and verified experts.
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
const StatsSection = () => {
  const stats = [
    { label: "Registered Citizens", value: "1.5M+", icon: "users", color: "text-blue-600" },
    { label: "Amendments Under Discussion", value: "42", icon: "clipboardList", color: "text-orange-600" },
    { label: "Total Posts Submitted", value: "75K+", icon: "messageSquare", color: "text-green-600" },
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
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
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
    </>
  );
};


// --- 1. DEFINE THE ORDER OF YOUR SLIDING TABS ---
// We add the Homepage '/' as the first item
const pageOrder = [
  '/', 
  '/trending', 
  '/vote', 
  '/posts', 
  '/constitution', 
  '/my-activity'
];
// Pages NOT in this list (like '/profile') will use a fade animation.

// --- 2. CUSTOM HOOK TO REMEMBER PREVIOUS VALUE ---
// This hook lets us compare the new location to the old one
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// --- 3. DEFINE ANIMATION VARIANTS ---
// These are the "instructions" for framer-motion
const slideVariants = {
  // 'custom' prop (our direction) is passed to these functions
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%', // Enter from right or left
    opacity: 0
  }),
  center: {
    zIndex: 1, // Keep the new page on top
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0, // Put the old page behind
    x: direction < 0 ? '100%' : '-100%', // Exit to right or left
    opacity: 0
  })
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 }
};

// Define the "spring" physics for the slide
const slideTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
};

// Define a simple fade
const fadeTransition = {
  opacity: { duration: 0.3 }
};


// --- Main App Component (MODIFIED for transitions) ---
const App = ({ user, onLogout }) => {
  const location = useLocation();
  // Get the *previous* pathname (e.g., '/trending')
  const prevPathname = usePrevious(location.pathname);

  // --- 4. CALCULATE ANIMATION DIRECTION ---
  const newIndex = pageOrder.indexOf(location.pathname);
  const oldIndex = pageOrder.indexOf(prevPathname);
  
  let direction = 0; // 0 = fade
  let isSliding = true;

  if (newIndex === -1 || oldIndex === -1) {
    // One of the pages is not in our 'pageOrder' array (e.g., /profile)
    isSliding = false; 
  } else if (newIndex > oldIndex) {
    direction = 1; // Sliding Forward (e.g., Trending -> Vote)
  } else if (newIndex < oldIndex) {
    direction = -1; // Sliding Backward (e.g., Posts -> Trending)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      <NavBar user={user} onLogout={onLogout} />

      <main className="flex-grow">
        {/* --- 5. ADD 'relative' AND 'overflow-hidden' --- */}
        {/* This container crops the animation so you don't get a scrollbar */}
        <div className="container mx-auto px-4 relative overflow-hidden">
        
        <AnimatePresence 
          mode="wait" 
          initial={false} 
          // Pass the calculated direction to the animation
          custom={direction}
        >
          {/* This is the key: 
            We wrap the <Routes> in a <motion.div>
            We use the location.pathname as the 'key' to force
            AnimatePresence to animate on change.
          */}
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={isSliding ? slideVariants : fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={isSliding ? slideTransition : fadeTransition}
            className="w-full" // Ensure the div takes full width
          >
            <Routes location={location}>
              {/* All routes are now plain, the wrapper handles the animation */}
              <Route path="/" element={<HomePage />} />
              <Route path="/trending" element={<TrendingPosts />} />
              <Route path="/my-activity" element={<MyActivity />} />
              <Route path="/profile" element={<ProfileView initialUser={user} />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/posts" element={<PostsList />} />
              <Route path="/constitution" element={<ConstitutionPage />} />

              {/* Footer Destination Routes */}
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/mission" element={<OurMissionPage />} />
              <Route path="/lawmaker-login" element={<LawmakerLoginPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/legal/terms" element={<TermsOfServicePage />} />
              <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/security" element={<SecurityPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        </div>
      </main>
      <Footer /> 
      <Chatbot /> 
    </div>
  );
};

export default App;

// /*
// ==================== HOW NAVIGATION & RENDERING WORK ====================
// (This part is just comments, no changes needed)
// ...
// =========================================================================
// */
