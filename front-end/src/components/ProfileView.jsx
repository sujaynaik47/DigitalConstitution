// ProfileView.jsx

import React, { useEffect, useState } from 'react';

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

  // Open modal when hash becomes #profile
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#profile') {
        setOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Load user data when modal opens
  useEffect(() => {
    if (!open) return;
    
    if (initialUser) {
      setUser(initialUser);
    } else {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          setUser(JSON.parse(raw));
        } else {
          setError('Unable to load user info.');
        }
      } catch (err) {
        console.log("Error from here",err)
        setError('Unable to load user info.');
      }
    }
  }, [open, initialUser]);

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

    setChanging(true);
    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: user?.email ?? initialUser?.email,
          currentPassword,
          newPassword
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

  const close = () => {
    setOpen(false);
    if (window.location.hash === '#profile') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  if (!open) return null;

  const opinionsCount = user?.opinionsCount ?? 
    (user?.opinions ? user.opinions.length : (user?.stats?.opinions ?? '—'));

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
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{user?.name ?? 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">{user?.email ?? 'No email available'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="text-sm text-gray-500">Opinions shared</div>
                <div className="text-2xl font-extrabold mt-2">{opinionsCount}</div>
                <div className="mt-6">
                  <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800">
                    View my opinions
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                >
                  {changing ? 'Changing…' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;