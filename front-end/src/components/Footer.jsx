// Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const Footer = () => {
  // Sample Destination Links
  const linkDestinations = {
    // Platform
    'About Us': '/about',
    'Our Mission': '/mission',
    'Lawmaker Access': '/lawmaker-login',
    
    // Support
    'FAQ': '/help#faq',
    'Help Center': '/help',
    'Contact Us': '/contact',
    
    // Legal
    'Terms of Service': '/legal/terms',
    'Privacy Policy': '/legal/privacy',
    'Security': '/legal/security',
    
    // Connect (Social Media)
    'Twitter': '#',
    'Facebook': '#',
    'LinkedIn': '#',
  };

  const InternalLink = ({ to, children }) => (
    <li>
      {/* Use Link component for internal navigation */}
      <Link to={to} className="hover:text-white">
        {children}
      </Link>
    </li>
  );

  const ExternalLink = ({ href, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-2xl hover:text-blue-400 transition duration-150"
    >
      {children}
    </a>
  );

  return (
    <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        
        {/* Platform Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
          <ul className="space-y-2 text-gray-400">
            <InternalLink to={linkDestinations['About Us']}>About Us</InternalLink>
            <InternalLink to={linkDestinations['Our Mission']}>Our Mission</InternalLink>
            <InternalLink to={linkDestinations['Lawmaker Access']}>Lawmaker Access</InternalLink>
          </ul>
        </div>
        
        {/* Support Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
          <ul className="space-y-2 text-gray-400">
            {/* Note: /help#faq uses a hash, but Link is still the preferred component for the base path */}
            <InternalLink to={linkDestinations['FAQ']}>FAQ</InternalLink> 
            <InternalLink to={linkDestinations['Help Center']}>Help Center</InternalLink>
            <InternalLink to={linkDestinations['Contact Us']}>Contact Us</InternalLink>
          </ul>
        </div>
        
        {/* Legal Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <InternalLink to={linkDestinations['Terms of Service']}>Terms of Service</InternalLink>
            <InternalLink to={linkDestinations['Privacy Policy']}>Privacy Policy</InternalLink>
            <InternalLink to={linkDestinations['Security']}>Security</InternalLink>
          </ul>
        </div>
        
        {/* Connect Links (Social Media) */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-lg text-orange-400">Connect</h4>
          <div className="flex space-x-4">
            <ExternalLink href={linkDestinations['Twitter']}>T</ExternalLink>
            <ExternalLink href={linkDestinations['Facebook']}>F</ExternalLink>
            <ExternalLink href={linkDestinations['LinkedIn']}>in</ExternalLink>
          </div>
          <p className="text-xs pt-4 text-gray-500">
            A non-partisan initiative.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          © 2025 Digital Constitution Platform. All rights reserved. 
          
        </p>
        <b className="text-xs text-gray-300" >Made in Bharath &nbsp;  <img src="https://flagcdn.com/w40/in.png" alt="India Flag" className="inline w-5 h-5" /> &nbsp;by D05 for the country to progress faster in the right direction and reducing the obstacles.</b>
      </div>
    </footer>
  );
};

export default Footer;
