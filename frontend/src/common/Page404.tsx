import React from 'react';

import { ROOT } from '../AppRoutes';
import AppTitle from './app-title/AppTitle';
import TestlabLinkButton from './button/TestlabLinkButton';

const Page404 = () => (
  <div className="not-found">
    <AppTitle heading="Ikke funnet" />
    <TestlabLinkButton title="Gå til hovedsiden" route={ROOT} />
  </div>
);

export default Page404;
