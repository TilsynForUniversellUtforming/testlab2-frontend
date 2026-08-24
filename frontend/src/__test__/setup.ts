import '@testing-library/jest-dom';

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(Document.prototype, 'adoptedStyleSheets', {
  configurable: true,
  get() {
    return this._adoptedStyleSheets || [];
  },
  set(value) {
    this._adoptedStyleSheets = value;
  },
});

Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
  configurable: true,
  get() {
    return this._adoptedStyleSheets || [];
  },
  set(value) {
    this._adoptedStyleSheets = value;
  },
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
