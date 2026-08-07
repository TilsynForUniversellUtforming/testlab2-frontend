import React from 'react';
import { Outlet, useOutletContext } from 'react-router';

const MaalingOverviewApp = () => <Outlet context={useOutletContext()} />;

export default MaalingOverviewApp;
