import './testreglar.scss';

import React from 'react';
import { Outlet } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import Navbar from './Navbar';

const TestreglarApp = () => {
  return (
    <>
      <AppTitle title="Testreglar" />
      <Navbar />
      <div className="testreglar__content">
        <Outlet />
      </div>
    </>
  );
};

export default TestreglarApp;
