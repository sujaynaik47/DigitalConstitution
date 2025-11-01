// This file is located at `front-end/tests/App.test.jsx`
// It tests the App.jsx file from `../src/App.jsx`
// This version works with the separated components and NO Firebase.

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx'; // Correctly imports the separated App component



// --- Test Suite ---
describe('Digital Constitution Platform Tests (No Firebase, Separated Components)', () => {

  // --- Login Page Tests ---
  describe('Login Page', () => {
    it('renders the login page by default (after loading)', async () => {
      render(<App />);
      // Wait for the "Loading Platform..." spinner to disappear
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      // Now check if the login page content is present
      expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument();
      expect(screen.getByText('Citizen')).toBeInTheDocument();
      expect(screen.getByText('Expert / Lawmaker')).toBeInTheDocument();
    });

    it('shows the Google Sign-in button on the Citizen tab by default', async () => {
      render(<App />);
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('switches to the Expert / Lawmaker tab and shows the login form', async () => {
      const user = userEvent.setup();
      render(<App />);
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      const expertTab = screen.getByText('Expert / Lawmaker');
      await user.click(expertTab);

      // Check that the Google button is gone
      expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();

      // Check that the expert form is visible
      expect(screen.getByText('Login using your verified credentials.')).toBeInTheDocument();
      expect(screen.getByLabelText('Verified Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login as Expert' })).toBeInTheDocument();
    });

    it('switches to the Expert Sign Up form with meaningful text', async () => {
      const user = userEvent.setup();
      render(<App />);
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      // Go to expert tab
      await user.click(screen.getByText('Expert / Lawmaker'));

      // Find and click the sign-up link with the meaningful text
      const signUpLink = screen.getByText('Expert or Lawmaker? Request a verified account.');
      await user.click(signUpLink);

      // Check for the new title
      expect(screen.getByText('Create your verified expert account.')).toBeInTheDocument();

      // Check for the "Confirm Password" field
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

      // Check for the new button text
      expect(screen.getByRole('button', { name: 'Register Expert Account' })).toBeInTheDocument();

      // Check for the "back to login" link
      const loginLink = screen.getByText('Already verified? Login here.');
      expect(loginLink).toBeInTheDocument();

      // Click back to login
      await user.click(loginLink);
      expect(screen.getByText('Login using your verified credentials.')).toBeInTheDocument();
    });

    it('switches to the Forgot Password form', async () => {
      const user = userEvent.setup();
      render(<App />);
      await waitFor(() => expect(screen.queryByText('Loading Platform...')).not.toBeInTheDocument());

      // Go to expert tab
      await user.click(screen.getByText('Expert / Lawmaker'));

      // Find and click the "Forgot Password?" link
      const forgotLink = screen.getByText('Forgot Password?');
      await user.click(forgotLink);

      // Check for the new title and button
      expect(screen.getByText('Reset your password.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Reset Email' })).toBeInTheDocument();

      // Password field should be hidden
      expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();

      // Check for the "Back to Login" link
      const loginLink = screen.getByText('Back to Login');
      expect(loginLink).toBeInTheDocument();

      // Click back to login
      await user.click(loginLink);
      expect(screen.getByRole('button', { name: 'Login as Expert' })).toBeInTheDocument();
    });
  });

  // --- Authentication Flow Tests ---
  describe('Authentication Flow', () => {
    it('shows the LoggedInView after clicking Google Sign In', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for app to load and be in logged out state
      await waitFor(() => expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument());

      // Simulate user clicking the Google login button
      const googleButton = screen.getByText('Sign in with Google');
      await user.click(googleButton);

      // Wait for the new view ("Welcome" screen) to appear
      // The App component's handleLogin should have updated the state
      await waitFor(() => {
        expect(screen.getByText('Welcome, Citizen User!')).toBeInTheDocument(); // Checks for the simulated user name
      });

      // Check that the login page is gone
      expect(screen.queryByText('Digital Constitution Platform')).not.toBeInTheDocument();
    });

    it('shows the LoggedInView after submitting Expert Login form', async () => {
      const user = userEvent.setup();
      render(<App />);
      await waitFor(() => expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument());

       // Go to expert tab
      await user.click(screen.getByText('Expert / Lawmaker'));

      // Fill in the form (content doesn't matter for the mock)
      await user.type(screen.getByLabelText('Verified Email'), 'test@expert.com');
      await user.type(screen.getByLabelText('Password'), 'password');

      // Click the login button
      const loginButton = screen.getByRole('button', { name: 'Login as Expert' });
      await user.click(loginButton);

      // Wait for the new view ("Welcome" screen) to appear
      await waitFor(() => {
        expect(screen.getByText('Welcome, Expert User!')).toBeInTheDocument(); // Checks for the simulated user name
      });

      expect(screen.queryByText('Digital Constitution Platform')).not.toBeInTheDocument();

    });


    it('logs the user out and returns to the login page', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. Simulate starting as logged in (by clicking login first)
      await waitFor(() => expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument());
      await user.click(screen.getByText('Sign in with Google'));
      const logoutButton = await screen.findByRole('button', { name: /Logout/i }); // Wait for Welcome screen

      // 2. Click the logout button
      await user.click(logoutButton);

      // 3. Wait for the login page to reappear
      await waitFor(() => {
        expect(screen.getByText('Digital Constitution Platform')).toBeInTheDocument();
      });

      // 4. Check that the "Welcome" message is gone
      expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
    });
  });
});