import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';


const queryClient = new QueryClient();
const locale = getLocale();
import NO from './lang/no.json';



import '@digdir/designsystemet-css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider
      locale={locale}
      defaultLocale="no"
      messages={NO}
    >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </IntlProvider>
  </React.StrictMode>
);

function getLocale() {
  return (
    globalThis.navigator.language || globalThis.navigator.languages[0] || 'no'
  );
}
