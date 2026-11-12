import React, { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';

import NO from './lang/no.json';

export const createAppQueryClient = () => new QueryClient();

export const getLocale = () => 'no';

export const getMessages = () => NO;

type AppProvidersProps = {
  children: ReactNode;
  queryClient: QueryClient;
};

export const AppProviders = ({ children, queryClient }: AppProvidersProps) => {
  return (
    <IntlProvider
      locale={getLocale()}
      defaultLocale="no"
      messages={getMessages()}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </IntlProvider>
  );
};

