// //Home.jsx

import React, { useState, useEffect } from 'react'; 
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// --- Main Application Pages ---
import TrendingPosts from "./TrendingPosts";
import MyActivity from "./MyActivity";
import ProfileView from "./ProfileView";
import Vote from "./Vote";
import PostsList from "./PostsList";
import ConstitutionPage from "./ConstitutionPage"; 

// --- Footer Destination Imports ---
import Footer from './Footer';
// Platform Links
import AboutUsPage from './AboutUsPage';
import OurMissionPage from './OurMissionPage';
import LawmakerLoginPage from './LawmakerLoginPage';

// Support Links
import HelpCenterPage from './HelpCenterPage'; 
import ContactUsPage from './ContactUsPage';

// Legal Links (using the 'legal' subfolder path)
import TermsOfServicePage from './legal/TermsOfServicePage';
import PrivacyPolicyPage from './legal/PrivacyPolicyPage';
import SecurityPage from './legal/SecurityPage';


// --- Icon Component ---
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

// --- Posts Display Component (omitted for brevity, assume content is stable) ---
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
      {posts.map((post) => (
        <div key={post.postId} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">User ID: {post.userId}</p>
              <p className="text-sm text-gray-500">Post ID: {post.postId}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">{post.articleTitle}</h3>
          <p className="text-gray-600 mb-4">{post.content}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>Article: {post.articleNumber}</p>
            <div className="flex gap-4">
              <span>👍 {post.agreeCount}</span>
              <span>👎 {post.disagreeCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Activity Section Component (omitted for brevity, assume content is stable) ---
const ActivitySection = ({ type }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = type === 'my-activity' ? 
          'http://localhost:5000/api/my-posts' : 
          'http://localhost:5000/api/trending-posts';
        
        const response = await fetch(endpoint, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [type]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  
  return <PostsDisplay posts={posts} type={type === 'my-activity' ? 'My Activity' : 'Trending'} />;
};


// --- NavBar Component (omitted for brevity, assume content is stable) ---
const NavBar = () => {
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
          </nav>
          
          <button className="md:hidden text-white hover:text-gray-200">
              <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Hero Section Component (omitted for brevity, assume content is stable) ---
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

// --- Stats Section Component (omitted for brevity, assume content is stable) ---
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

// --- HomePage Component (omitted for brevity, assume content is stable) ---
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

// The actual Footer component is imported, or assumed to be defined externally/below (but for a complete file, let's keep it separate for correctness)

// --- Main App Component ---
const App = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <NavBar />
      <main className="flex-grow">
        <div className="container mx-auto px-4">
        <Routes>
          {/* Main App Routes */}
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
        </div>
      </main>
      <Footer /> 
    </div>
  );
};

export default App;

// /*
// ==================== HOW NAVIGATION & RENDERING WORK ====================

// 1️⃣ When a nav button (e.g. “Trending”) is clicked:
//     → handleNavigation(path) is called → navigate('/trending') runs.
//     → This uses React Router’s useNavigate() to update the browser history
//       and change the current URL path in React Router’s internal state.

// 2️⃣ Router detects the location change:
//     → React Router updates its context (the "current location").
//     → The <Routes> component inside App re-evaluates all <Route> paths.
//     → It finds the matching route (<Route path="/trending" ... />)
//       and renders that route’s element (<TrendingPosts />).

// 3️⃣ Component mounting & unmounting:
//     → <TrendingPosts /> is now mounted (its function runs and JSX is rendered).
//     → When navigating to another route later, it will unmount automatically.
//     → This process happens only for the component inside <Routes>.

// 4️⃣ Why NavBar (and Footer) stay visible:
//     → In App.jsx, <NavBar /> and <Footer /> are placed *outside* of <Routes>.
//     → React Router only swaps the components inside <Routes>.
//     → So NavBar and Footer remain mounted and persistent across pages.

// 5️⃣ Active button highlighting:
//     → NavBar uses useLocation() to read the current path.
//     → When location changes, useEffect updates currentPath.
//     → The button whose path matches currentPath gets the “active” styling
//       (e.g., background color changes).

// 6️⃣ React rendering behavior:
//     → React only re-renders parts of the DOM that actually changed.
//     → Since only the <Routes> output changes on navigation,
//       NavBar and Footer DOM remain untouched (they’re not re-rendered).

// 🧠 In short:
// Clicking a button → navigate('/trending') → Router updates location →
// <Routes> swaps the visible page component → NavBar stays mounted the entire time.

// =========================================================================
// */
