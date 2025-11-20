// Register jest-dom matchers (toBeInTheDocument, etc.) for Vitest
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock ResizeObserver which is used by Radix UI components
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
window.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};
