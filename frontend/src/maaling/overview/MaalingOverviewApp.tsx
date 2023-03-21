import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import { MaalingContext } from '../types';
import MaalingNavbar from './MaalingNavbar';

const MaalingOverviewApp = () => {
  const context: MaalingContext = useOutletContext();

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
        <MaalingNavbar />
      </div>
      <Outlet context={context} />
    </>
  );
};

export default MaalingOverviewApp;
