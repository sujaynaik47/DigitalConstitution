import React from 'react';

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

export default Footer;