import React from 'react';

import AppTitle from './app-title/AppTitle';
import appRoutes from './appRoutes';
import TestlabLinkButton from './button/TestlabLinkButton';

const Page404 = () => (
  <div className="not-found">
    <AppTitle heading="Ikke funnet" />
    <TestlabLinkButton title="Gå til hovedsiden" route={appRoutes.ROOT} />
  </div>
);

export default Page404;
