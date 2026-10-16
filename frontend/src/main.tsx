import React from 'react';
import ReactDOM from 'react-dom/client';

import '@digdir/designsystemet-css';

import App from './App';
import { AppProviders, createAppQueryClient } from './AppProviders';

const queryClient = createAppQueryClient();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element');
}

ReactDOM.hydrateRoot(
  rootElement,
  <React.StrictMode>
    <AppProviders queryClient={queryClient}>
      <App />
    </AppProviders>
  </React.StrictMode>
);
