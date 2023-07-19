import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { MaalingContext } from '../types';

const MaalingOverviewApp = () => {
  const context: MaalingContext = useOutletContext();

  return <Outlet context={context} />;
};

export default MaalingOverviewApp;
