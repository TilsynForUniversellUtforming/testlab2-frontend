import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Outlet, useOutletContext } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import { SakContext } from '../types';
import SakNavbar from './SakNavbar';

const SakOverviewApp = () => {
  const context: SakContext = useOutletContext();

  if (context.contextLoading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  }

  if (!context.maaling || context.contextError) {
    return <ErrorCard />;
  }

  const { navn } = context.maaling;

  return (
    <>
      <AppTitle title={navn} />
      <div className="pb-4">
        <SakNavbar />
      </div>
      <Outlet context={context} />
    </>
  );
};

export default SakOverviewApp;
