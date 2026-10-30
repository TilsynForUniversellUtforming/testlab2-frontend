/// <reference types="vite/client" />

declare global {
  interface Window {
    __staticRouterHydrationData?: unknown;
  }

  // eslint-disable-next-line no-var
  var __TESTLAB2_API_BASE__: string | undefined;
}

export {};

