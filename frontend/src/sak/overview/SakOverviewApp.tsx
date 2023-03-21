import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import { SakContext } from '../types';
import SakNavbar from './SakNavbar';

const SakOverviewApp = () => {
  const context: SakContext = useOutletContext();

  if (context.contextLoading) {
    return <span>SPINNER</span>;
  }

  if (!context.maaling || context.contextError) {
    return <ErrorCard />;
  }

  const { navn } = context.maaling;

  return (
    <>
      <AppTitle heading={navn} />
      <div className="pb-4">
        <SakNavbar />
      </div>
      <Outlet context={context} />
    </>
  );
};

export default SakOverviewApp;
