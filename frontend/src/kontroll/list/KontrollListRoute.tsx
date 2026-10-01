import { RouteObject } from 'react-router';

import {
  fetchAlleKontroller,
  fetchAlleKontrollerForBrukar,
} from '../kontroll-api';
import KontrollList from './KontrollList';

export const KontrollListRoute: RouteObject = {
  element: <KontrollList />,
  handle: { name: 'Alle kontroller' },
  path: 'liste',
  loader: fetchAlleKontroller,
};

export const KontrollListForBrukarRoute: RouteObject = {
  element: <KontrollList />,
  handle: { name: 'Mine kontroller' },
  path: 'mine-kontroller',
  loader: fetchAlleKontrollerForBrukar,
};
