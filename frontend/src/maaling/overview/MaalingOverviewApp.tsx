import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

const MaalingOverviewApp = () => <Outlet context={useOutletContext()} />;

export default MaalingOverviewApp;
