import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';

import { AppRoutes } from './AppRoutes';
import { AppProviders, createAppQueryClient } from './AppProviders';

type RenderResult =
  | Response
  | {
      html: string;
      status: number;
    };

const staticHandler = createStaticHandler([AppRoutes]);

export async function render(request: Request): Promise<RenderResult> {
  const context = await staticHandler.query(request);

  if (context instanceof Response) {
    return context;
  }

  const router = createStaticRouter(staticHandler.dataRoutes, context);
  const queryClient = createAppQueryClient();

  const html = renderToString(
    <AppProviders queryClient={queryClient}>
      <StaticRouterProvider router={router} context={context} />
    </AppProviders>
  );

  return {
    html,
    status: context.statusCode ?? 200,
  };
}

