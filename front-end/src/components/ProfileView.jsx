// ProfileView.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfileView = ({ initialUser = null }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [postsCountState, setPostsCountState] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Open modal when hash becomes #profile or when route is /profile
  useEffect(() => {
    const checkOpen = () => {
      if (window.location.hash === '#profile' || location.pathname === '/profile') {
        setOpen(true);
      }
    };
    checkOpen();
    window.addEventListener('hashchange', checkOpen);
    return () => window.removeEventListener('hashchange', checkOpen);
  }, [location]);

  // Load user data when modal opens
  useEffect(() => {
    if (!open) return;
    
    if (initialUser) {
      setUser(initialUser);
    } else {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const userData = JSON.parse(raw);
          setUser(userData);
        } else {
          setError('Unable to load user info.');
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError('Unable to load user info.');
      }
    }
  }, [open, initialUser]);

  // If user data doesn't include posts count, try fetching it from the API
  useEffect(() => {
    if (!open) return;
    const target = user || initialUser;
    if (!target || postsCountState !== null) return;

    const hasArray = Array.isArray(target.posts);
    const hasNumeric = typeof target.postsCount === 'number' || typeof target.stats?.posts === 'number' || typeof target.posts === 'number';
    if (hasArray || hasNumeric) return; // nothing to fetch

    const fetchCount = async () => {
      try {
        const userId = target.userId;
        if (!userId) return;
        const res = await fetch(`http://localhost:5000/api/posts/user/${userId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const len = Array.isArray(data.posts) ? data.posts.length : (typeof data.count === 'number' ? data.count : null);
        if (typeof len === 'number') setPostsCountState(len);
      } catch {
        // ignore silently
      }
    };

    fetchCount();
  }, [open, user, initialUser, postsCountState]);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setChangeMessage('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangeMessage('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeMessage('New password and confirmation do not match.');
      return;
    }

    const userIdToSend = user?.userId || initialUser?.userId;
    
    if (!userIdToSend) {
      setChangeMessage('User ID not found. Please reload the page.');
      return;
    }

    console.log('Sending password change request with:', {
      userId: userIdToSend,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword
    });

    setChanging(true);
    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: userIdToSend,
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }

      setChangeMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setChangeMessage('Failed to change password: ' + (err.message || err));
    } finally {
      setChanging(false);
    }
  };

  const handleViewMyPosts = () => {
    close();
    navigate('/my-activity');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('referencePost');
    
    // Close the modal
    setOpen(false);
    
    // Redirect to home page
    navigate('/', { replace: true });
    
    // Optionally reload to clear any cached state
    window.location.reload();
  };

  const close = () => {
    setOpen(false);
    try {
      if (window.location.hash === '#profile') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else if (location.pathname === '/profile') {
        // navigate back to home (replace so it doesn't add a history entry)
        navigate('/', { replace: true });
      }
    } catch {
      // fallback: just close
    }
  };

  if (!open) return null;

  const postsCount = (() => {
    if (typeof postsCountState === 'number') return postsCountState;
    const target = user || initialUser;
    if (!target) return '—';
    if (Array.isArray(target.posts)) return target.posts.length;
    if (typeof target.posts === 'number') return target.posts;
    if (typeof target.postsCount === 'number') return target.postsCount;
    if (typeof target.stats?.posts === 'number') return target.stats.posts;
    // try parsing numeric-looking strings
    const maybe = target.postsCount ?? target.stats?.posts ?? target.posts;
    if (typeof maybe === 'string' && /^[0-9]+$/.test(maybe)) return parseInt(maybe, 10);
    return '—';
  })();

  // Get userId - prioritize from user object
  const displayUserId = user?.userId || initialUser?.userId || 'N/A';
  const displayEmail = user?.email || initialUser?.email || 'No email available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={close} />

      <div className="relative bg-white rounded-xl shadow-md w-11/12 max-w-xl mx-auto overflow-hidden">
        <div className="p-4 border-b flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Profile</h2>
            <p className="text-sm text-gray-500">Your account details and settings</p>
          </div>
          <button onClick={close} className="text-gray-500 hover:text-gray-700" aria-label="Close profile">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">
                    {/* Show first 4 chars of userId in avatar */}
                    {displayUserId !== 'N/A' && displayUserId.length >= 4 
                      ? displayUserId.slice(0, 4).toUpperCase() 
                      : 'USER'}
                  </div>
                  <div className="flex-1">
                    {/* Show full userId */}
                    <div className="text-base font-mono font-bold break-all text-gray-800">
                      {displayUserId}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{displayEmail}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="text-sm text-gray-500">Posts shared</div>
                <div className="text-2xl font-extrabold mt-2">{postsCount}</div>
                <div className="mt-6">
                  <button 
                    onClick={handleViewMyPosts}
                    className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    View my posts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Change Password</h4>
            <form onSubmit={onChangePassword} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Current password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full mt-1 border rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">New password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full mt-1 border rounded px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Confirm new password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full mt-1 border rounded px-3 py-2" 
                  required 
                />
              </div>

              {changeMessage && (
                <div className={`text-sm ${changeMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {changeMessage}
                </div>
              )}

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={changing} 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {changing ? 'Changing…' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Logout Button */}
          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;










// // ProfileView.jsx

// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ProfileView = ({ initialUser = null }) => {
//   const [open, setOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');

//   // Change password form state
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [changing, setChanging] = useState(false);
//   const [changeMessage, setChangeMessage] = useState('');

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Open modal when hash becomes #profile or when route is /profile
//   useEffect(() => {
//     const checkOpen = () => {
//       if (window.location.hash === '#profile' || location.pathname === '/profile') {
//         setOpen(true);
//       }
//     };
//     checkOpen();
//     window.addEventListener('hashchange', checkOpen);
//     return () => window.removeEventListener('hashchange', checkOpen);
//   }, [location]);

//   // Load user data when modal opens
//   useEffect(() => {
//     if (!open) return;
    
//     if (initialUser) {
//       setUser(initialUser);
//     } else {
//       try {
//         const raw = localStorage.getItem('user');
//         if (raw) {
//           const userData = JSON.parse(raw);
//           setUser(userData);
//         } else {
//           setError('Unable to load user info.');
//         }
//       } catch (err) {
//         console.error("Error loading user data:", err);
//         setError('Unable to load user info.');
//       }
//     }
//   }, [open, initialUser]);

//   const onChangePassword = async (e) => {
//     e.preventDefault();
//     setChangeMessage('');
    
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       setChangeMessage('Please fill all fields.');
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setChangeMessage('New password and confirmation do not match.');
//       return;
//     }

//     const userIdToSend = user?.userId || initialUser?.userId;
    
//     if (!userIdToSend) {
//       setChangeMessage('User ID not found. Please reload the page.');
//       return;
//     }

//     console.log('Sending password change request with:', {
//       userId: userIdToSend,
//       hasCurrentPassword: !!currentPassword,
//       hasNewPassword: !!newPassword
//     });

//     setChanging(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/change-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           userId: userIdToSend,
//           currentPassword: currentPassword,
//           newPassword: newPassword
//         })
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.message || `Error ${res.status}`);
//       }

//       setChangeMessage('Password changed successfully.');
//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//     } catch (err) {
//       setChangeMessage('Failed to change password: ' + (err.message || err));
//     } finally {
//       setChanging(false);
//     }
//   };

//   const close = () => {
//     setOpen(false);
//     try {
//       if (window.location.hash === '#profile') {
//         history.replaceState(null, '', window.location.pathname + window.location.search);
//       } else if (location.pathname === '/profile') {
//         // navigate back to home (replace so it doesn't add a history entry)
//         navigate('/', { replace: true });
//       }
//     } catch {
//       // fallback: just close
//     }
//   };

//   if (!open) return null;

//   const postsCount = user?.postsCount ?? 
//     (user?.posts ? user.posts.length : (user?.stats?.posts ?? '—'));

//   // Get userId - prioritize from user object
//   const displayUserId = user?.userId || initialUser?.userId || 'N/A';
//   const displayEmail = user?.email || initialUser?.email || 'No email available';

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black opacity-50" onClick={close} />

//       <div className="relative bg-white rounded-xl shadow-md w-11/12 max-w-xl mx-auto overflow-hidden">
//         <div className="p-4 border-b flex items-start justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">Profile</h2>
//             <p className="text-sm text-gray-500">Your account details and settings</p>
//           </div>
//           <button onClick={close} className="text-gray-500 hover:text-gray-700" aria-label="Close profile">
//             ✕
//           </button>
//         </div>

//         <div className="p-4 space-y-4">
//           {error ? (
//             <div className="text-center text-red-600">{error}</div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="col-span-2 bg-gray-50 p-6 rounded-lg">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">
//                     {/* Show first 4 chars of userId in avatar */}
//                     {displayUserId !== 'N/A' && displayUserId.length >= 4 
//                       ? displayUserId.slice(0, 4).toUpperCase() 
//                       : 'USER'}
//                   </div>
//                   <div className="flex-1">
//                     {/* Show full userId */}
//                     <div className="text-base font-mono font-bold break-all text-gray-800">
//                       {displayUserId}
//                     </div>
//                     <div className="text-sm text-gray-500 mt-1">{displayEmail}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg border">
//                 <div className="text-sm text-gray-500">Posts shared</div>
//                 <div className="text-2xl font-extrabold mt-2">{postsCount}</div>
//                 <div className="mt-6">
//                   <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800">
//                     View my posts
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Change Password */}
//           <div className="bg-white p-6 rounded-lg border">
//             <h4 className="font-semibold mb-2">Change Password</h4>
//             <form onSubmit={onChangePassword} className="space-y-3">
//               <div>
//                 <label className="text-sm text-gray-600">Current password</label>
//                 <input 
//                   type="password" 
//                   value={currentPassword} 
//                   onChange={(e) => setCurrentPassword(e.target.value)} 
//                   className="w-full mt-1 border rounded px-3 py-2" 
//                   required 
//                 />
//               </div>
//               <div>
//                 <label className="text-sm text-gray-600">New password</label>
//                 <input 
//                   type="password" 
//                   value={newPassword} 
//                   onChange={(e) => setNewPassword(e.target.value)} 
//                   className="w-full mt-1 border rounded px-3 py-2" 
//                   required 
//                 />
//               </div>
//               <div>
//                 <label className="text-sm text-gray-600">Confirm new password</label>
//                 <input 
//                   type="password" 
//                   value={confirmPassword} 
//                   onChange={(e) => setConfirmPassword(e.target.value)} 
//                   className="w-full mt-1 border rounded px-3 py-2" 
//                   required 
//                 />
//               </div>

//               {changeMessage && (
//                 <div className={`text-sm ${changeMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
//                   {changeMessage}
//                 </div>
//               )}

//               <div className="flex justify-end">
//                 <button 
//                   type="submit" 
//                   disabled={changing} 
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
//                 >
//                   {changing ? 'Changing…' : 'Change Password'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileView;
