/* global describe, it, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../components/ui/Toast';
import { vi } from 'vitest';

describe('Toast Component', () => {
  const mockToast = {
    id: 1,
    message: 'Test message',
    type: 'success',
    duration: 3000
  };

  it('renders correctly with message', () => {
    render(<Toast toast={mockToast} onRemove={vi.fn()} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onRemove when close button is clicked', () => {
    vi.useFakeTimers();
    const handleRemove = vi.fn();
    render(<Toast toast={mockToast} onRemove={handleRemove} />);
    
    // In Toast.jsx, closing has a 300ms delay for animation
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    vi.advanceTimersByTime(300);
    expect(handleRemove).toHaveBeenCalledWith(mockToast.id);
    vi.useRealTimers();
  });
});
