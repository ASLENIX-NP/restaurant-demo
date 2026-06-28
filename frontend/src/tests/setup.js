import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test to ensure DOM is clear
afterEach(() => {
  cleanup();
});
