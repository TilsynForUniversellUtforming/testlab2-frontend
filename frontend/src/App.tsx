import './index.scss';

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppRoutes } from './AppRoutes';

const router = createBrowserRouter([AppRoutes]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
