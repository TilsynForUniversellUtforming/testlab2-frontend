import { Outlet, useOutletContext } from 'react-router';

import { TestregelContext } from '../types';

const RegelsettApp = () => {
  const state: TestregelContext = useOutletContext();

  return <Outlet context={state} />;
};

export default RegelsettApp;
