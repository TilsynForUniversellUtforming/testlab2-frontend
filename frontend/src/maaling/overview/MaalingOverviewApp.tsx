import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Outlet, useOutletContext } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import { MaalingContext } from '../types';
import MaalingNavbar from './MaalingNavbar';

const MaalingOverviewApp = () => {
  const context: MaalingContext = useOutletContext();

  if (context.loading) {
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

  if (!context.maaling || context.error) {
    return <ErrorCard />;
  }

  const { navn } = context.maaling;

  return (
    <>
      <AppTitle title={navn} />
      <div className="pb-4">
        <MaalingNavbar />
      </div>
      <Outlet context={context} />
    </>
  );
};

export default MaalingOverviewApp;
