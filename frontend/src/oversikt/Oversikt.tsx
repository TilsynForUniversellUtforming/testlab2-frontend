import './Oversikt.scss';

import AppTitle from '@common/app-title/AppTitle';
import TestlabLinkButton from '@common/button/TestlabLinkButton';
import { ButtonVariant } from '@common/types';
import { AppRoute } from '@common/util/routeUtils';
import { Heading } from '@digdir/design-system-react';
import { SAK_CREATE } from '@sak/SakRoutes';
import { TEST_ROOT } from '@test/TestingRoutes';
import React from 'react';

import { anna, saksbehandling, testing, utval } from '../AppRoutes';

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
            variant={ButtonVariant.Outline}
            icon={<img src={route.imgSrc} alt={''} />}
            size="large"
            color="second"
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
            route={SAK_CREATE}
            title={SAK_CREATE.navn}
            variant={ButtonVariant.Outline}
            icon={
              <img
                className="lenker__img"
                src={SAK_CREATE.imgSrc}
                alt={SAK_CREATE.navn}
              />
            }
            size="large"
            color="second"
            fullWidth={true}
            className="oversikt__sak-ny"
          />
          <TestlabLinkButton
            route={TEST_ROOT}
            title={TEST_ROOT.navn}
            variant={ButtonVariant.Outline}
            icon={
              <img
                className="lenker__img"
                src={TEST_ROOT.imgSrc}
                alt={TEST_ROOT.navn}
              />
            }
            size="large"
            color="second"
            fullWidth={true}
            className="oversikt__sak-ny"
            disabled={TEST_ROOT.disabled}
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
