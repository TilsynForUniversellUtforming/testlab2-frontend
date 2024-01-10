import {
  AppRoute,
  createPath,
  editPath,
  idPath,
} from '@common/util/routeUtils';
import { fetchAlleSaker } from '@sak/api/sak-api';
import SakList from '@sak/list/SakList';
import SakApp from '@sak/SakApp';
import SakCreate from '@sak/SakCreate';
import { RouteObject } from 'react-router-dom';

import nySakImg from '../assets/ny_sak.svg';
import sakerImg from '../assets/saker.svg';

export const SAK_ROOT: AppRoute = {
  navn: 'Saker',
  path: 'sak',
  imgSrc: sakerImg,
};

export const SAK: AppRoute = {
  navn: 'Sak',
  path: idPath,
  parentRoute: SAK_ROOT,
};

export const SAK_CREATE: AppRoute = {
  navn: 'Ny sak',
  path: createPath,
  parentRoute: SAK_ROOT,
  imgSrc: nySakImg,
};

export const SAK_EDIT: AppRoute = {
  navn: 'Endre sak',
  path: editPath,
  parentRoute: SAK_ROOT,
};

export const SakRoutes: RouteObject = {
  path: SAK_ROOT.path,
  element: <SakApp />,
  handle: { name: SAK_ROOT.navn },
  children: [
    {
      index: true,
      loader: fetchAlleSaker,
      element: <SakList />,
    },
    {
      path: createPath,
      element: <SakCreate />,
      handle: { name: SAK_CREATE.navn },
    },
  ],
};
