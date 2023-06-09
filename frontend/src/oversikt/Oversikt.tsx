import './Oversikt.scss';

import { Heading } from '@digdir/design-system-react';
import React from 'react';

import AppTitle from '../common/app-title/AppTitle';
import {
  AppRoute,
  appRoutes,
  saksbehandling,
  utval,
} from '../common/appRoutes';
import TestlabLinkButton from '../common/button/TestlabLinkButton';

interface OversiktLinkListProps {
  heading: string;
  routes: AppRoute[];
}

const OversiktLinkList = ({ heading, routes }: OversiktLinkListProps) => (
  <div className="oversikt__links-item">
    <AppTitle heading={heading} />
    <div className="lenker">
      {routes.map((route) => (
        <div className="lenker__wrapper" key={route.navn}>
          <TestlabLinkButton
            route={route}
            title={route.navn}
            variant="outline"
            icon={<img src={route.imgSrc} alt={route.navn} />}
            size="large"
            color="secondary"
            fullWidth={true}
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
      </div>
      <div className="oversikt__links">
        {[
          { heading: 'Utval', routes: utval },
          { heading: 'Saksbehandling', routes: saksbehandling },
        ].map(({ heading, routes }) => (
          <OversiktLinkList heading={heading} routes={routes} key={heading} />
        ))}
      </div>
    </div>
  );
};

export default Oversikt;
