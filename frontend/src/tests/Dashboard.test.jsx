import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../pages/admin/Dashboard';

// Mock contexts
vi.mock('../context/OrderContext', () => ({
  useOrders: () => ({
    isLoading: false,
    orders: [
      { status: 'Completed', amount: 1500, date: new Date().toISOString().split('T')[0] },
      { status: 'Completed', amount: 500, date: new Date().toISOString().split('T')[0] }
    ]
  })
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Admin User', role: 'Admin' }
  })
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn()
  })
}));

// Mock recharts to avoid jsdom render errors
vi.mock('recharts', () => {
  const MockComponent = ({ children }) => <div>{children}</div>;
  return {
    ResponsiveContainer: MockComponent,
    AreaChart: MockComponent,
    Area: MockComponent,
    XAxis: MockComponent,
    YAxis: MockComponent,
    CartesianGrid: MockComponent,
    Tooltip: MockComponent,
    PieChart: MockComponent,
    Pie: MockComponent,
    Cell: MockComponent
  };
});

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('Admin Dashboard', () => {
  test('renders dashboard header and calculates total revenue correctly', async () => {
    renderWithProviders(<Dashboard />);
    
    // Check header and wait for the 200ms setTimeout skeleton loader to finish
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      // Check if the mock orders (1500 + 500 = 2000) are calculated correctly
      expect(screen.getByText(/Rs\. 2,000/i)).toBeInTheDocument();
    });
  });
});
