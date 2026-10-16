import './index.scss';

import React from 'react';
import {
  createBrowserRouter,
  type HydrationState,
  RouterProvider,
} from 'react-router';

import { AppRoutes } from './AppRoutes';

const hydrationData =
  typeof window === 'undefined'
    ? undefined
    : (window.__staticRouterHydrationData as HydrationState | undefined);

const router = createBrowserRouter([AppRoutes], {
  hydrationData,
});
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
