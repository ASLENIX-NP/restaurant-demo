import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../pages/auth/Login';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

// Mock the AuthContext hook
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock the PWA install hook
vi.mock('../hooks/usePWAInstall', () => ({
  usePWAInstall: vi.fn()
}));

const mockLogin = vi.fn();

// Wrapper to provide Routing
const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      user: null,
    });
    usePWAInstall.mockReturnValue({
      isInstallable: false,
      installPWA: vi.fn()
    });
  });

  test('renders the login form by default', () => {
    renderWithProviders(<Login />);
    
    // Check for branding
    expect(screen.getByText(/मिठ्ठो चिया/i)).toBeInTheDocument();
    
    // Check for inputs
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('submits login form with user credentials', async () => {
    mockLogin.mockResolvedValue({ success: true, role: 'admin' });
    
    renderWithProviders(<Login />);
    
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Simulate typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitBtn);

    // Verify context method was called with correct data
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  test('switches to register view when register link is clicked', async () => {
    renderWithProviders(<Login />);
    
    const registerLink = screen.getByText(/create one now/i);
    fireEvent.click(registerLink);
    
    // Should now show the registration form
    expect(await screen.findByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/sarah@example.com/i)).toBeInTheDocument();
  });
});
