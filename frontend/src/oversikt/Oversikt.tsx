import './Oversikt.scss';

import AppTitle from '@common/app-title/AppTitle';
import {
  anna,
  AppRoute,
  appRoutes,
  saksbehandling,
  testing,
  utval,
} from '@common/appRoutes';
import TestlabLinkButton from '@common/button/TestlabLinkButton';
import { Heading } from '@digdir/design-system-react';
import React from 'react';

interface OversiktLinkListProps {
  heading: string;
  routes: AppRoute[];
}

const OversiktLinkList = ({ heading, routes }: OversiktLinkListProps) => (
  <div className="oversikt__links-item">
    <AppTitle heading={heading} size="large" />
    <div className="lenker">
      {routes.map((route) => (
        <div className="lenker__wrapper" key={route.navn}>
          <TestlabLinkButton
            route={route}
            title={route.navn}
            variant="outline"
            icon={<img src={route.imgSrc} alt={''} />}
            size="large"
            color="secondary"
            fullWidth={true}
            disabled={route.disabled}
          />
        </div>
      ))}
    </div>
  </div>
);

const Oversikt = () => {
  return (
    <div className="oversikt">
      <div className="oversikt__sak">
        <Heading size="xlarge" title="Meny" spacing={true}>
          Meny
        </Heading>
        <div className="oversikt__sak-links">
          <TestlabLinkButton
            route={appRoutes.SAK_CREATE}
            title={appRoutes.SAK_CREATE.navn}
            variant="outline"
            icon={
              <img
                className="lenker__img"
                src={appRoutes.SAK_CREATE.imgSrc}
                alt={appRoutes.SAK_CREATE.navn}
              />
            }
            size="large"
            color="secondary"
            fullWidth={true}
            className="oversikt__sak-ny"
          />
          <TestlabLinkButton
            route={appRoutes.NY_TEST_ROOT}
            title={appRoutes.NY_TEST_ROOT.navn}
            variant="outline"
            icon={
              <img
                className="lenker__img"
                src={appRoutes.NY_TEST_ROOT.imgSrc}
                alt={appRoutes.NY_TEST_ROOT.navn}
              />
            }
            size="large"
            color="secondary"
            fullWidth={true}
            className="oversikt__sak-ny"
            disabled={appRoutes.NY_TEST_ROOT.disabled}
          />
        </div>
      </div>
      <div className="oversikt__links">
        {[
          { heading: 'Utval', routes: utval },
          { heading: 'Saksbehandling', routes: saksbehandling },
          { heading: 'Testing', routes: testing },
          { heading: 'Anna', routes: anna },
        ].map(({ heading, routes }) => (
          <OversiktLinkList heading={heading} routes={routes} key={heading} />
        ))}
      </div>
    </div>
  );
};

export default Oversikt;
