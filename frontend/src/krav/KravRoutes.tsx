import { AppRoute } from '@common/util/routeUtils';
import { RouteObject } from 'react-router-dom';

import kravImg from '../assets/krav.svg';
import KravApp from './KravApp';

export const KRAV_LIST: AppRoute = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
  disabled: true,
};

export const KravRoutes: RouteObject = {
  path: KRAV_LIST.path,
  handle: { name: KRAV_LIST.navn },
  element: <KravApp />,
};
