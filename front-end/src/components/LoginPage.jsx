// // import React, { useState } from 'react';
// // import Icon from './Icon.jsx';

// // const LoginPage = ({ onLogin }) => {
// //   const [loginType, setLoginType] = useState('citizen');
// //   const [expertMode, setExpertMode] = useState('login');
// //   const [message, setMessage] = useState('');

// //   const handleGoogleLogin = async () => {
// //     setMessage("Simulating Google login...");
// //     setTimeout(() => {
// //       onLogin({ displayName: 'Citizen User' });
// //     }, 500);
// //   };

// //   const handleExpertSubmit = (e) => {
// //     e.preventDefault();
// //     if (expertMode === 'login') {
// //       setMessage("Simulating expert login...");
// //       setTimeout(() => {
// //         onLogin({ displayName: 'Expert User' });
// //       }, 500);
// //     } else if (expertMode === 'signup') {
// //       setMessage("Simulating expert registration...");
// //       setTimeout(() => {
// //         onLogin({ displayName: 'New Expert User' });
// //       }, 500);
// //     } else {
// //       console.log("Forgot password submitted (placeholder)");
// //       setMessage("Password reset email sent (placeholder).");
// //     }
// //   };

// //   const getExpertTitle = () => {
// //     if (expertMode === 'login') return 'Login using your verified credentials.';
// //     if (expertMode === 'signup') return 'Create your verified expert account.';
// //     if (expertMode === 'forgot') return 'Reset your password.';
// //     return '';
// //   };

// //   const getSubmitButtonText = () => {
// //     if (expertMode === 'login') return 'Login as Expert';
// //     if (expertMode === 'signup') return 'Register Expert Account';
// //     if (expertMode === 'forgot') return 'Send Reset Email';
// //     return '';
// //   };

// //   const getToggleText = () => {
// //     if (expertMode === 'login') {
// //       return "Expert or Lawmaker? Request a verified account.";
// //     }
// //     if (expertMode === 'signup') {
// //       return "Already verified? Login here.";
// //     }
// //     if (expertMode === 'forgot') {
// //       return "Back to Login";
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
// //       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
// //         {/* Tricolor border accent */}
// //         <div className="absolute top-0 left-0 w-full h-2 flex">
// //           <div className="w-1/3 h-full bg-orange-500"></div>
// //           <div className="w-1/3 h-full bg-white"></div>
// //           <div className="w-1/3 h-full bg-green-600"></div>
// //         </div>

// //         {/* Header */}
// //         <div className="flex flex-col items-center mb-6 pt-4">
// //           <img
// //             src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
// //             alt="Emblem of India"
// //             className="h-16 w-16 object-contain mb-4"
// //             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/ccc/333?text=Logo'; }}
// //           />
// //           <h1 className="text-2xl font-bold text-blue-900 text-center">
// //             Digital Constitution Platform
// //           </h1>
// //           <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
// //         </div>

// //         {/* Tabs */}
// //         <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
// //           <button
// //             onClick={() => setLoginType('citizen')}
// //             className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
// //               loginType === 'citizen' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
// //             }`}
// //           >
// //             Citizen
// //           </button>
// //           <button
// //             onClick={() => setLoginType('expert')}
// //             className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
// //               loginType === 'expert' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
// //             }`}
// //           >
// //             Expert / Lawmaker
// //           </button>
// //         </div>

// //         {/* Citizen Form */}
// //         {loginType === 'citizen' && (
// //           <div className="flex flex-col items-center">
// //             <p className="text-center text-sm text-gray-700 mb-5">
// //               Join the discussion using your Google account.
// //             </p>
// //             <button
// //               type="button"
// //               onClick={handleGoogleLogin}
// //               className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-3"
// //             >
// //               <Icon name="google" className="w-5 h-5" />
// //               Sign in with Google
// //             </button>
// //           </div>
// //         )}

// //         {/* Expert Form */}
// //         {loginType === 'expert' && (
// //           <form onSubmit={handleExpertSubmit}>
// //              <p className="text-center text-sm text-gray-700 mb-5">
// //               {getExpertTitle()}
// //             </p>
// //             <div className="mb-4">
// //               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
// //                 Verified Email
// //               </label>
// //               <input
// //                 type="email" id="email" placeholder="your.email@gov.in"
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 required
// //               />
// //             </div>

// //             {expertMode !== 'forgot' && (
// //               <div className="mb-4">
// //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Password
// //                 </label>
// //                 <input
// //                   type="password" id="password" placeholder="••••••••"
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
// //             )}

// //             {expertMode === 'signup' && (
// //               <div className="mb-4">
// //                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Confirm Password
// //                 </label>
// //                 <input
// //                   type="password" id="confirm-password" placeholder="Confirm Password"
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
// //             )}

// //             {expertMode === 'login' && (
// //               <div className="text-right mb-4">
// //                 <button type="button" onClick={() => setExpertMode('forgot')} className="text-sm text-blue-600 hover:underline">
// //                   Forgot Password?
// //                 </button>
// //               </div>
// //             )}

// //             <button type="submit" className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
// //               {getSubmitButtonText()}
// //             </button>

// //             <div className="text-center mt-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setExpertMode(expertMode === 'login' ? 'signup' : (expertMode === 'signup' ? 'login' : 'login'))}
// //                 className="text-sm text-blue-600 hover:underline"
// //               >
// //                 {getToggleText()}
// //               </button>
// //             </div>
// //           </form>
// //         )}

// //         {message && (
// //           <p className="text-center text-sm text-blue-700 mt-4">{message}</p>
// //         )}
// //       </div>

// //       <footer className="text-center mt-8 text-xs text-gray-600">
// //         <p>© 2025 Digital Constitution Platform. All rights reserved.</p>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default LoginPage;
// import React, { useEffect, useState } from 'react';

// // --- MOCK COMPONENTS AND UTILITIES (Required for Single-File Environment) ---

// // 1. Mock Icon Component: Since the original file imports Icon from './Icon.jsx',
// // we define a simple placeholder component here to prevent import errors.
// const Icon = ({ name, className }) => {
//   if (name === 'google') {
//     // Simple inline SVG for Google logo
//     return (
//       <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
//         <path fill="#FFC107" d="M43.6 20.4H24v7.9h10.9c-.8 5-4.7 8.5-10.9 8.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.4 0 6.4 1.4 8.6 3.6l5.9-5.9C36.6 5.8 30.7 3 24 3 13.5 3 4.8 11.7 4.8 22s8.7 19 19.2 19c11.3 0 19.5-8.5 19.5-18.7 0-1.2-.2-2.3-.4-3.4z"/>
//         <path fill="#FF3D00" d="M6.5 22c0-2.4.6-4.7 1.7-6.7l-6-4.6C1.9 14.8 1 18.2 1 22s.9 7.2 2.2 10.3l6-4.6c-1-2-1.7-4.3-1.7-6.7z"/>
//         <path fill="#4CAF50" d="M24 41c5.9 0 10.9-2.4 14.5-6.5l-6-4.6c-1.9 2.4-4.7 3.9-8.5 3.9-6.6 0-12-5.4-12-12h-6c0 10.5 8.7 19 19.2 19z"/>
//         <path fill="#1976D2" d="M43.6 20.4c.1 1.2.2 2.3.2 3.4 0 1.2-.1 2.4-.3 3.5H24v-7.9h19.6c.1.9.2 1.9.2 3.4z"/>
//       </svg>
//     );
//   }
//   return <div className={className}></div>; // Placeholder for other icons
// };

// // 2. Mock JWT Decode: Since 'jwt-decode' cannot be installed, we use a utility
// // function to parse the base64-encoded payload directly from the GSI token.
// const decodeJwtToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     // Convert base64url to base64, then decode
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     console.error("Failed to decode JWT:", e);
//     // Return a fallback object if decoding fails
//     return { name: "Guest User", email: "guest@example.com", picture: null };
//   }
// };

// // --- MAIN LOGIN PAGE COMPONENT ---

// const LoginPage = ({ onLogin }) => {
//   const [loginType, setLoginType] = useState('citizen');
//   const [expertMode, setExpertMode] = useState('login');
//   const [message, setMessage] = useState('Please sign in to continue.');

//   // NOTE: In a real app, this should be configured on the server.
//   // Using a placeholder client ID for simulation purposes.
//   const GOOGLE_CLIENT_ID = "643839752757-02lgp6m87gddf941rr30vi8u4jfibgni.apps.googleusercontent.com";

//   // Handles the response from Google after successful sign-in
//   const handleGoogleResponse = (response) => {
//     // Use the mock decoder since 'jwt-decode' library is not available
//     const userObject = decodeJwtToken(response.credential);
//     console.log("Google user successfully decoded:", userObject);

//     setMessage(`Welcome, ${userObject.name}! Logging you in...`);
//     // NOTE: Removed the fetch call to the backend as it requires a running
//     // local server (http://localhost:5000), which is unavailable here.
//     // We proceed directly to the app login simulation.
//     setTimeout(() => {
//       onLogin({ displayName: userObject.name, email: userObject.email });
//     }, 500);
//   };

//   // Effect to load the Google Sign-In SDK and initialize the button
//   useEffect(() => {
//     // Only attempt to load if the login type is 'citizen' to keep it clean
//     if (loginType === 'citizen') {
//       const loadGoogleScript = () => {
//         // Check if script is already loaded
//         if (window.google) {
//           initializeGoogleGSI();
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.defer = true;
//         document.body.appendChild(script);

//         script.onload = initializeGoogleGSI;
//       };

//       const initializeGoogleGSI = () => {
//         if (window.google && document.getElementById("googleSignInDiv")) {
//           window.google.accounts.id.initialize({
//             client_id: GOOGLE_CLIENT_ID,
//             callback: handleGoogleResponse,
//             auto_select: false,
//             // You can use 'one_tap' here if desired, but we'll stick to button
//           });

//           // Renders the customized Google button in the specified div
//           window.google.accounts.id.renderButton(
//             document.getElementById("googleSignInDiv"),
//             { theme: "outline", size: "large", text: "signin_with", width: "392" } // wide width to match form
//           );
//         }
//       };
      
//       loadGoogleScript();

//       // Cleanup function (optional, but good practice)
//       return () => {
//         // You could potentially remove the script if needed, but often not necessary for GSI
//       };
//     }
//   }, [loginType]);


//   const handleExpertSubmit = (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;

//     if (expertMode === 'login') {
//       setMessage(`Expert login attempt for: ${email}...`);
//       setTimeout(() => onLogin({ displayName: 'Verified Expert' }), 500);
//     } else if (expertMode === 'signup') {
//       setMessage(`Expert registration request for: ${email}...`);
//       setTimeout(() => onLogin({ displayName: 'New Expert Account' }), 500);
//     } else {
//       setMessage(`Password reset link sent to ${email} (placeholder).`);
//     }
//   };

//   const getExpertTitle = () => {
//     if (expertMode === 'login') return 'Login using your verified credentials.';
//     if (expertMode === 'signup') return 'Create your verified expert account.';
//     if (expertMode === 'forgot') return 'Reset your password.';
//     return '';
//   };

//   const getSubmitButtonText = () => {
//     if (expertMode === 'login') return 'Login as Expert';
//     if (expertMode === 'signup') return 'Register Expert Account';
//     if (expertMode === 'forgot') return 'Send Reset Email';
//     return '';
//   };

//   const getToggleText = () => {
//     if (expertMode === 'login') return "Expert or Lawmaker? Request a verified account.";
//     if (expertMode === 'signup') return "Already verified? Login here.";
//     if (expertMode === 'forgot') return "Back to Login";
//   };

//   // Function to handle the toggle between login/signup/forgot
//   const toggleExpertMode = () => {
//     if (expertMode === 'login') {
//       setExpertMode('signup');
//     } else if (expertMode === 'signup') {
//       setExpertMode('login');
//     } else {
//       setExpertMode('login'); // Back to login from forgot
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
//         {/* Tricolor border accent */}
//         <div className="absolute top-0 left-0 w-full h-2 flex">
//           <div className="w-1/3 h-full bg-orange-500"></div>
//           <div className="w-1/3 h-full bg-white"></div>
//           <div className="w-1/3 h-full bg-green-600"></div>
//         </div>

//         {/* Header */}
//         <div className="flex flex-col items-center mb-6 pt-4">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
//             alt="Emblem of India"
//             className="h-16 w-16 object-contain mb-4"
//             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/ccc/333?text=Logo'; }}
//           />
//           <h1 className="text-2xl font-bold text-blue-900 text-center">
//             Digital Constitution Platform
//           </h1>
//           <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
//           <button
//             onClick={() => setLoginType('citizen')}
//             className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
//               loginType === 'citizen' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             Citizen
//           </button>
//           <button
//             onClick={() => setLoginType('expert')}
//             className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
//               loginType === 'expert' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             Expert / Lawmaker
//           </button>
//         </div>

//         {/* Citizen Google Login */}
//         {loginType === 'citizen' && (
//           <div className="flex flex-col items-center">
//             <p className="text-center text-sm text-gray-700 mb-5">
//               Join the discussion using your Google account.
//             </p>
//             {/* THIS IS THE DIV WHERE THE GOOGLE SDK RENDERS THE BUTTON */}
//             <div id="googleSignInDiv" className="w-full"></div>
            
//             <p className="text-xs text-gray-500 mt-2">
//                 Note: A live Google Client ID is required for a successful connection.
//             </p>
//           </div>
//         )}

//         {/* Expert Form */}
//         {loginType === 'expert' && (
//           <form onSubmit={handleExpertSubmit}>
//              <p className="text-center text-sm text-gray-700 mb-5">
//               {getExpertTitle()}
//             </p>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Verified Email
//               </label>
//               <input
//                 type="email" id="email" name="email" placeholder="your.email@gov.in"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {expertMode !== 'forgot' && (
//               <div className="mb-4">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password" id="password" name="password" placeholder="••••••••"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             )}

//             {expertMode === 'signup' && (
//               <div className="mb-4">
//                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             )}

//             {expertMode === 'login' && (
//               <div className="text-right mb-4">
//                 <button type="button" onClick={() => setExpertMode('forgot')} className="text-sm text-blue-600 hover:underline">
//                   Forgot Password?
//                 </button>
//               </div>
//             )}

//             <button type="submit" className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
//               {getSubmitButtonText()}
//             </button>

//             <div className="text-center mt-4">
//               <button
//                 type="button"
//                 onClick={toggleExpertMode}
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 {getToggleText()}
//               </button>
//             </div>
//           </form>
//         )}

//         {message && (
//           <p className="text-center text-sm text-blue-700 mt-4">{message}</p>
//         )}
//       </div>

//       <footer className="text-center mt-8 text-xs text-gray-600">
//         <p>© 2025 Digital Constitution Platform. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useEffect, useState } from 'react';


// --- ICON COMPONENT ---
const Icon = ({ name, className }) => {
  if (name === 'google') {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.4H24v7.9h10.9c-.8 5-4.7 8.5-10.9 8.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.4 0 6.4 1.4 8.6 3.6l5.9-5.9C36.6 5.8 30.7 3 24 3 13.5 3 4.8 11.7 4.8 22s8.7 19 19.2 19c11.3 0 19.5-8.5 19.5-18.7 0-1.2-.2-2.3-.4-3.4z"/>
        <path fill="#FF3D00" d="M6.5 22c0-2.4.6-4.7 1.7-6.7l-6-4.6C1.9 14.8 1 18.2 1 22s.9 7.2 2.2 10.3l6-4.6c-1-2-1.7-4.3-1.7-6.7z"/>
        <path fill="#4CAF50" d="M24 41c5.9 0 10.9-2.4 14.5-6.5l-6-4.6c-1.9 2.4-4.7 3.9-8.5 3.9-6.6 0-12-5.4-12-12h-6c0 10.5 8.7 19 19.2 19z"/>
        <path fill="#1976D2" d="M43.6 20.4c.1 1.2.2 2.3.2 3.4 0 1.2-.1 2.4-.3 3.5H24v-7.9h19.6c.1.9.2 1.9.2 3.4z"/>
      </svg>
    );
  }
  return <div className={className}></div>;
};

// --- UTILITY TO DECODE GOOGLE TOKEN ---
const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return { name: "Guest User", email: "guest@example.com" };
  }
};

// --- MAIN LOGIN COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('citizen');
  const [expertMode, setExpertMode] = useState('login');
  const [message, setMessage] = useState('Please sign in to continue.');

  const GOOGLE_CLIENT_ID = "643839752757-02lgp6m87gddf941rr30vi8u4jfibgni.apps.googleusercontent.com";

  // ✅ Handle Google Sign-in Response
  const handleGoogleResponse = async (response) => {
    const userObject = decodeJwtToken(response.credential);
    console.log("Google User:", userObject);

    try {
      // ✅ Send user data to backend for registration/login
      const res = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userObject.name,
          email: userObject.email,
          picture: userObject.picture,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      setMessage(`Welcome, ${data.name || userObject.name}!`);
      onLogin({ displayName: data.name || userObject.name, email: userObject.email });

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Error connecting to backend");
    }
  };

  // ✅ Initialize Google Button
  useEffect(() => {
    if (loginType !== 'citizen') return;

    const loadGoogleScript = () => {
      if (window.google) {
        initializeGSI();
        return;
      }
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initializeGSI;
    };

    const initializeGSI = () => {
      if (window.google && document.getElementById("googleSignInDiv")) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", text: "signin_with" }
        );
      }
    };

    loadGoogleScript();
  }, [loginType]);

  // ✅ Expert form submit handler
  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password?.value;

    try {
      if (expertMode === 'login') {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Login failed");

        setMessage("Login successful!");
        onLogin({ displayName: data.name || "Expert User", email });

      } else if (expertMode === 'signup') {
        const confirmPassword = e.target['confirm-password'].value;
        if (password !== confirmPassword)
          return alert("Passwords do not match!");

        const res = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: email.split('@')[0] }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Signup failed");

        setMessage("Registration successful!");
        onLogin({ displayName: data.name || "New Expert", email });
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  // UI Helpers
  const getExpertTitle = () => expertMode === 'login'
    ? 'Login using your verified credentials.'
    : expertMode === 'signup'
    ? 'Create your verified expert account.'
    : 'Reset your password.';

  const getSubmitButtonText = () =>
    expertMode === 'login'
      ? 'Login as Expert'
      : expertMode === 'signup'
      ? 'Register Expert Account'
      : 'Send Reset Email';

  const getToggleText = () =>
    expertMode === 'login'
      ? "Expert or Lawmaker? Request a verified account."
      : expertMode === 'signup'
      ? "Already verified? Login here."
      : "Back to Login";

  const toggleExpertMode = () => {
    if (expertMode === 'login') setExpertMode('signup');
    else setExpertMode('login');
  };

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/3 h-full bg-orange-500"></div>
          <div className="w-1/3 h-full bg-white"></div>
          <div className="w-1/3 h-full bg-green-600"></div>
        </div>

        <div className="flex flex-col items-center mb-6 pt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
            alt="Emblem"
            className="h-16 w-16 mb-4"
          />
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            Digital Constitution Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setLoginType('citizen')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'citizen' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => setLoginType('expert')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'expert' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expert / Lawmaker
          </button>
        </div>

        {/* Citizen (Google) */}
        {loginType === 'citizen' && (
          <div className="flex flex-col items-center">
            <p className="text-center text-sm text-gray-700 mb-5">
              Join the discussion using your Google account.
            </p>
            <div id="googleSignInDiv" className="w-full"></div>
          </div>
        )}

        {/* Expert */}
        {loginType === 'expert' && (
          <form onSubmit={handleExpertSubmit}>
            <p className="text-center text-sm text-gray-700 mb-5">{getExpertTitle()}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified Email</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-2 border rounded" />
            </div>

            {expertMode !== 'forgot' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" name="password" required className="w-full px-4 py-2 border rounded" />
              </div>
            )}

            {expertMode === 'signup' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirm-password" required className="w-full px-4 py-2 border rounded" />
              </div>
            )}

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              {getSubmitButtonText()}
            </button>

            <div className="text-center mt-4">
              <button type="button" onClick={toggleExpertMode} className="text-sm text-blue-600 hover:underline">
                {getToggleText()}
              </button>
            </div>
          </form>
        )}

        {message && <p className="text-center text-sm text-blue-700 mt-4">{message}</p>}
      </div>

      <footer className="text-center mt-8 text-xs text-gray-600">
        <p>© 2025 Digital Constitution Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
