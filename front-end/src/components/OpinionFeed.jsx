import React, { useState } from 'react';

// --- 1. Icon Component (Copied from your teammate's file) ---
// This is required for the NavBar to work
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

// --- 2. NavBar Component (Copied from your teammate's file) ---
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

// --- 3. Your OpinionPost Component (Rewritten with Tailwind) ---
const OpinionPost = ({ post, onAgreeClick, onDisagreeClick, onCommentClick }) => {
  return (
    // This replaces your ".opinion-post-card"
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* This replaces your ".post-header" */}
      <header className="flex justify-between text-sm text-gray-500 mb-2">
        <span>User Id: {post.userId}</span>
        <span>Post Id: {post.postId}</span>
      </header>
      
      {/* This replaces your ".article-link" */}
      <p className="block text-lg font-semibold text-blue-700 hover:underline mb-4">
        Article: {post.articleTitle}
      </p>
      
      {/* This replaces your ".opinion-body" */}
      <div className="text-gray-800 mb-4">
        <p>{post.opinionText}</p>
      </div>
      
      {/* This replaces your ".post-actions" */}
      <footer className="flex justify-start space-x-4 border-t border-gray-200 pt-4">
        <button 
          onClick={() => onAgreeClick(post.postId)}
          className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-green-200"
        >
          Agree
        </button>
        <button 
          onClick={() => onCommentClick(post.postId)}
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-gray-300"
        >
          My opinion on this
        </button>
        <button 
          onClick={() => onDisagreeClick(post.postId)}
          className="bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-red-200"
        >
          Disagree
        </button>
      </footer>
    </div>
  );
};

// --- 4. Footer Component (Copied from your teammate's file) ---
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Our Mission</a></li>
            <li><a href="#" className="hover:text-white">Lawmaker Access</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
          </ul>
        </div>
        
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


// --- 5. Your Main Page Component (Combining It All) ---
// This is the component you should export and use in your router

// Mock data to make the page display something
const MOCK_OPINION_POSTS = [
  {
    userId: 'sujan_01',
    postId: 'pid-123',
    articleTitle: 'Article 14: Equality before law',
    opinionText: 'This is a great article, but I found a potential loophole regarding digital-only entities. We should discuss this.'
  },
  {
    userId: 'varun_23',
    postId: 'pid-456',
    articleTitle: 'Article 21: Protection of life and personal liberty',
    opinionText: 'The interpretation of "personal liberty" needs to be explicitly extended to include digital privacy and data ownership.'
  }
];

const OpinionFeedPage = () => {
  // Your logic from HomePage.jsx
  const [posts, setPosts] = useState(MOCK_OPINION_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState(null);

  const handleCommentClick = (postId) => {
    setCommentingPostId(postId);
    setIsModalOpen(true);
  };

  // Mock click handlers
  const handleAgreeClick = (postId) => alert(`You agreed with post ${postId}`);
  const handleDisagreeClick = (postId) => alert(`You disagreed with post ${postId}`);

  return (
    // This is the main page wrapper
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <NavBar />
      
      {/* This is your page content */}
      <main className="flex-grow container mx-auto px-4 py-8">

        {/* This is your "New Opinion" tab */}
        <div className="mb-6">
          <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 hover:bg-green-700 transform hover:scale-105">
            Submit a New Opinion
          </button>
        </div>

        {/* This is your "post-feed" */}
        <div className="max-w-3xl mx-auto">
          {posts.map(post => (
            <OpinionPost 
              key={post.postId} 
              post={post}
              onCommentClick={handleCommentClick}
              onAgreeClick={handleAgreeClick}
              onDisagreeClick={handleDisagreeClick}
            />
          ))}
        </div>
      </main>

      {/* This is your Modal (styled with Tailwind) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Click outside to close
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"
            onClick={e => e.stopPropagation()} // Prevent click inside from closing
          >
            <h3 className="text-2xl font-bold mb-4">Commenting on post: {commentingPostId}</h3>
            <textarea 
              placeholder="Write your comment..." 
              className="w-full h-32 p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-300"
              >
                Close
              </button>
              <button 
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-blue-700"
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

// Export the main page
export default OpinionFeedPage;