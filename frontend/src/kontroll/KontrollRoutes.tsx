import ErrorCard from '@common/error/ErrorCard';
import { AppRoute } from '@common/util/routeUtils';
import { Outlet } from 'react-router';
import {
  RouteObject,
  ScrollRestoration,
  useRouteError,
} from 'react-router-dom';

import nySakImg from '../assets/ny_sak.svg';
import sakerImg from '../assets/saker.svg';
import { KontrollListRoute } from './list/KontrollListRoute';
import { OpprettKontrollRoute } from './opprett-kontroll/OpprettKontrollRoute';
import { OppsummeringRoute } from './oppsummering/OppsummeringRoute';
import { SideutvalRoute } from './sideutval/SideutvalRoute';
import { VelgLoesningerRoute } from './velg-loesninger/VelgLoesningerRoute';
import { VelgTestreglarRoute } from './velg-testreglar/VelgTestreglarRoute';

export const KONTROLL_LISTE = {
  navn: 'Kontroller',
  path: 'kontroll/liste',
  imgSrc: sakerImg,
};

export const KONTROLL_CREATE: AppRoute = {
  navn: 'Ny kontroll',
  path: 'kontroll',
  imgSrc: nySakImg,
};

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
  errorElement: <ErrorElement />,
  children: [
    ...OpprettKontrollRoute,
    KontrollListRoute,
    VelgLoesningerRoute,
    VelgTestreglarRoute,
    SideutvalRoute,
    OppsummeringRoute,
  ],
};

function ErrorElement() {
  const error = useRouteError() as Error;
  console.error(error);
  return <ErrorCard error={error} />;
}
