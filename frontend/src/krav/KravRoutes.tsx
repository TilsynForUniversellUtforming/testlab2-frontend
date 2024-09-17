import { AppRoute } from '@common/util/routeUtils';
import { RouteObject } from 'react-router-dom';

import kravImg from '../assets/krav.svg';
import { listKrav } from './api/krav-api';
import KravApp from './KravApp';
import { Krav } from './types';

export const KRAV_LIST: AppRoute = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
  disabled: false,
};

export const KravRoutes: RouteObject = {
  path: KRAV_LIST.path,
  handle: { name: KRAV_LIST.navn },
  loader: async (): Promise<Krav[]> => {
    return await listKrav();
  },
  element: <KravApp />,
};
