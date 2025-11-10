//NavBar.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('/');
  
  const links = [
    { name: 'Trending', icon: 'trendingUp', path: '/trending' },
    { name: 'Vote', icon: 'vote', path: '/vote' },
    { name: 'Posts', icon: 'clipboardList', path: '/posts' },
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
              <span>Digital Platform</span>
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

export default NavBar;
