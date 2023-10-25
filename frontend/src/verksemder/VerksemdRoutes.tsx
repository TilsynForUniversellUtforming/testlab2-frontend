import { AppRoute } from '@common/util/routeUtils';
import VerksemderApp from '@verksemder/VerksemderApp';
import { RouteObject } from 'react-router-dom';

import verksemderImg from '../assets/verksemder.svg';

export const VERKSEMD_LIST: AppRoute = {
  navn: 'Verksemder',
  path: 'verksemder',
  imgSrc: verksemderImg,
  disabled: true,
};

export const VerksemdRoutes: RouteObject = {
  path: VERKSEMD_LIST.path,
  element: <VerksemderApp />,
  handle: { name: VERKSEMD_LIST.navn },
};
