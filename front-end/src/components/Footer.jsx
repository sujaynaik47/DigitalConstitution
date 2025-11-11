// Footer.jsx

import React from 'react';

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
    'Twitter': 'https://twitter.com/DigitalPlatform', // Use external link for social media
    'Facebook': 'https://facebook.com/DigitalPlatform',
    'LinkedIn': 'https://linkedin.com/company/DigitalPlatform',
  };

  return (
    <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href={linkDestinations['About Us']} className="hover:text-white">About Us</a></li>
            <li><a href={linkDestinations['Our Mission']} className="hover:text-white">Our Mission</a></li>
            <li><a href={linkDestinations['Lawmaker Access']} className="hover:text-white">Lawmaker Access</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href={linkDestinations['FAQ']} className="hover:text-white">FAQ</a></li>
            <li><a href={linkDestinations['Help Center']} className="hover:text-white">Help Center</a></li>
            <li><a href={linkDestinations['Contact Us']} className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-orange-400">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href={linkDestinations['Terms of Service']} className="hover:text-white">Terms of Service</a></li>
            <li><a href={linkDestinations['Privacy Policy']} className="hover:text-white">Privacy Policy</a></li>
            <li><a href={linkDestinations['Security']} className="hover:text-white">Security</a></li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-lg text-orange-400">Connect</h4>
          <div className="flex space-x-4">
            <a 
              href={linkDestinations['Twitter']} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-2xl hover:text-blue-400 transition duration-150"
            >
              T
            </a>
            <a 
              href={linkDestinations['Facebook']} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-2xl hover:text-blue-400 transition duration-150"
            >
              F
            </a>
            <a 
              href={linkDestinations['LinkedIn']} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-2xl hover:text-blue-400 transition duration-150"
            >
              in
            </a>
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







// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
//       <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
//         <div>
//           <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
//           <ul className="space-y-2 text-gray-400">
//             <li><a href="#" className="hover:text-white">About Us</a></li>
//             <li><a href="#" className="hover:text-white">Our Mission</a></li>
//             <li><a href="#" className="hover:text-white">Lawmaker Access</a></li>
//           </ul>
//         </div>
        
//         <div>
//           <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
//           <ul className="space-y-2 text-gray-400">
//             <li><a href="#" className="hover:text-white">FAQ</a></li>
//             <li><a href="#" className="hover:text-white">Help Center</a></li>
//             <li><a href="#" className="hover:text-white">Contact Us</a></li>
//           </ul>
//         </div>
        
//         <div>
//           <h4 className="font-bold text-lg mb-4 text-orange-400">Legal</h4>
//           <ul className="space-y-2 text-gray-400">
//             <li><a href="#" className="hover:text-white">Terms of Service</a></li>
//             <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
//             <li><a href="#" className="hover:text-white">Security</a></li>
//           </ul>
//         </div>
        
//         <div className="flex flex-col space-y-3">
//           <h4 className="font-bold text-lg text-orange-400">Connect</h4>
//           <div className="flex space-x-4">
//             <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">T</a>
//             <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">F</a>
//             <a href="#" className="text-2xl hover:text-blue-400 transition duration-150">in</a>
//           </div>
//           <p className="text-xs pt-4 text-gray-500">
//             A non-partisan, government-backed initiative.
//           </p>
//         </div>
//       </div>
//       <div className="text-center mt-12 pt-6 border-t border-gray-700">
//         <p className="text-xs text-gray-500">
//           © 2025 Digital Constitution Platform. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
