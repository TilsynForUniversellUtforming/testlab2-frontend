import './testreglar.scss';

import React from 'react';
import { Outlet } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import routes from '../common/routes';
import Navbar from './Navbar';

const TestreglarApp = () => {
  return (
    <>
      <AppTitle title={routes.TESTREGLAR.navn} />
      <Navbar />
      <div className="testreglar__content">
        <Outlet />
      </div>
    </>
  );
};

export default TestreglarApp;
