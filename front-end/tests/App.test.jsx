// This file is located at `front-end/tests/App.test.jsx`
// This is the FIXED version

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx'; // Imports the app from your `src` folder

// --- Mocks ---
const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockSignInAnonymously = vi.fn();
const mockSignInWithCustomToken = vi.fn();

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  // FIX 1: Mock GoogleAuthProvider as a class, not a function
  GoogleAuthProvider: class MockGoogleAuthProvider {},
  signInWithPopup: (auth, provider) => mockSignInWithPopup(auth, provider),
  onAuthStateChanged: (auth, callback) => mockOnAuthStateChanged(auth, callback),
  signOut: (auth) => mockSignOut(auth),
  signInAnonymously: (auth) => mockSignInAnonymously(auth),
  signInWithCustomToken: (auth, token) => mockSignInWithCustomToken(auth, token),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

// Mock for import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'test-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test-domain',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
      VITE_FIREBASE_APP_ID: 'test-app',
    },
  },
});

// --- Test Suite ---
describe('Digital Constitution Platform Tests', () => {

  let sendAuthUpdate; 
  
  beforeEach(() => {
    vi.clearAllMocks();

    // FIX 2: A more robust mock for onAuthStateChanged
    // This just captures the callback, letting the App's useEffect
    // run its full logic (including the anonymous sign-in).
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      sendAuthUpdate = (user) => {
        // Wrap state updates in act() to prevent warnings
        act(() => {
          callback(user);
        });
      };
      return vi.fn(); // Return an unsubscribe function
    });
    
    mockSignInAnonymously.mockResolvedValue({ user: { uid: 'anon123', isAnonymous: true } });
  });

  // --- Login Page Tests ---
  describe('Login Page', () => {
    it('renders the login page by default (after loading)', async () => {
      render(<App />);
      
      // Simulate auth being ready and user being logged out
      act(() => {
        sendAuthUpdate(null);
      });
      
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument();
      expect(screen.getByText('Citizen')).toBeInTheDocument();
      expect(screen.getByText('Expert / Lawmaker')).toBeInTheDocument();
    });

    it('shows the Google Sign-in button on the Citizen tab by default', async () => {
      render(<App />);
      act(() => { sendAuthUpdate(null); });
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('switches to the Expert / Lawmaker tab and shows the login form', async () => {
      const user = userEvent.setup();
      render(<App />);
      act(() => { sendAuthUpdate(null); });
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      const expertTab = screen.getByText('Expert / Lawmaker');
      await user.click(expertTab);

      expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
      expect(screen.getByText('Login using your verified credentials.')).toBeInTheDocument();
      expect(screen.getByLabelText('Verified Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login as Expert' })).toBeInTheDocument();
    });

    it('switches to the Expert Sign Up form with meaningful text', async () => {
      const user = userEvent.setup();
      render(<App />);
      act(() => { sendAuthUpdate(null); });
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      await user.click(screen.getByText('Expert / Lawmaker'));
      const signUpLink = screen.getByText('Expert or Lawmaker? Request a verified account.');
      await user.click(signUpLink);

      expect(screen.getByText('Create your verified expert account.')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Register Expert Account' })).toBeInTheDocument();

      const loginLink = screen.getByText('Already verified? Login here.');
      await user.click(loginLink);
      expect(screen.getByText('Login using your verified credentials.')).toBeInTheDocument();
    });

    it('switches to the Forgot Password form', async () => {
      const user = userEvent.setup();
      render(<App />);
      act(() => { sendAuthUpdate(null); });
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      await user.click(screen.getByText('Expert / Lawmaker'));
      const forgotLink = screen.getByText('Forgot Password?');
      await user.click(forgotLink);

      expect(screen.getByText('Reset your password.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Reset Email' })).toBeInTheDocument();
      expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();

      const loginLink = screen.getByText('Back to Login');
      await user.click(loginLink);
      expect(screen.getByRole('button', { name: 'Login as Expert' })).toBeInTheDocument();
    });
  });

  // --- Authentication Flow Tests ---
  describe('Authentication Flow', () => {
    it('shows the LoggedInView after a successful login', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      act(() => { sendAuthUpdate(null); });
      await waitFor(() => expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument());

      const mockUser = { displayName: 'Test User', uid: '123', isAnonymous: false };
      mockSignInWithPopup.mockResolvedValue({ user: mockUser });

      // Simulate user clicking the button
      await user.click(screen.getByText('Sign in with Google'));

      // Simulate Firebase sending the auth update
      sendAuthUpdate(mockUser);

      await waitFor(() => {
        expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
      });

      expect(screen.queryByText('Digital Constitution Platform')).not.toBeInTheDocument();
    });

    it('logs the user out and returns to the login page', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. Start as logged in
      const mockUser = { displayName: 'Test User', uid: '123', isAnonymous: false };
      act(() => {
        sendAuthUpdate(mockUser);
      });

      // 2. Wait for the "Welcome" screen
      // We must find the button *after* the state has updated
      const logoutButton = await screen.findByRole('button', { name: /Logout/i });

      // 3. Click the logout button
      await user.click(logoutButton);
      
      // 4. Simulate Firebase sending the auth update
      sendAuthUpdate(null);

      // 5. Wait for the login page to reappear
      await waitFor(() => {
        expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument();
      });

      // 6. Check that the "Welcome" message is gone
      expect(screen.queryByText('Welcome, Test User!')).not.toBeInTheDocument();
    });
  });
});