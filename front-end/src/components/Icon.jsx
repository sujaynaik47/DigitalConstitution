import React from 'react';

const Icon = ({ name, className }) => {
  const icons = {
    google: (
      <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.1-6.99-7.01s3.13-7.01 6.99-7.01c2.18 0 3.54.88 4.38 1.69l2.6-2.59C16.97 1.01 14.9 0 12.48 0 5.88 0 0 5.58 0 12.01s5.88 12.01 12.48 12.01c7.25 0 12.08-4.88 12.08-12.01 0-.76-.08-1.5-.2-2.22l-11.88.01z" fill="currentColor" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  };

  return <span className={className}>{icons[name]}</span> || null;
};

export default Icon;