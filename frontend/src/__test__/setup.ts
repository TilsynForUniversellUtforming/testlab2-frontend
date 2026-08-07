import '@testing-library/jest-dom';

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

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

// // Mock CSSStyleSheet if you use `new CSSStyleSheet()`
// class MockCSSStyleSheet {
//   replaceSync(cssText) {
//     this.cssText = cssText;
//   }
//   replace(cssText) {
//     this.cssText = cssText;
//     return Promise.resolve(this);
//   }
// }
//
// globalThis.CSSStyleSheet = MockCSSStyleSheet;