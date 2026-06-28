/* global describe, it, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/ui/Modal';
import { vi } from 'vitest';

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} title="Hidden Modal"><div>Content</div></Modal>);
    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <Modal isOpen={true} title="Visible Modal" subtitle="Test Subtitle">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Visible Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} title="Close Test" onClose={handleClose}>Content</Modal>);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(<Modal isOpen={true} title="Backdrop Test" onClose={handleClose}>Content</Modal>);
    
    // The backdrop is the first child div
    const backdrop = container.firstChild;
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} title="Inner Click Test" onClose={handleClose}>
        <div data-testid="inner-content">Content</div>
      </Modal>
    );
    
    const innerContent = screen.getByTestId('inner-content');
    fireEvent.click(innerContent);
    expect(handleClose).not.toHaveBeenCalled();
  });
});
