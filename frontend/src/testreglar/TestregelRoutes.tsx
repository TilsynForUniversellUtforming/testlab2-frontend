import {
  AppRoute,
  createPath,
  idPath,
  listPath,
} from '@common/util/routeUtils';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { defer, RouteObject } from 'react-router-dom';

import testingImg from '../assets/testreglar.svg';
import RegelsettApp from './regelsett/RegelsettApp';
import RegelsettCreate from './regelsett/RegelsettCreate';
import RegelsettEdit from './regelsett/RegelsettEdit';
import RegelsettList from './regelsett/RegelsettList';
import TestregelCreate from './testreglar-liste/TestregelCreate';
import TestregelEdit from './testreglar-liste/TestregelEdit';
import TestregelList from './testreglar-liste/TestregelList';
import TestreglarApp from './TestreglarApp';

export const TESTREGEL_ROOT: AppRoute = {
  navn: 'Testreglar',
  path: 'testreglar',
  imgSrc: testingImg,
};

export const TESTREGEL_LIST: AppRoute = {
  navn: 'Testreglar',
  path: listPath,
  parentRoute: TESTREGEL_ROOT,
};

export const TESTREGEL_CREATE: AppRoute = {
  navn: 'Ny testregel',
  path: createPath,
  parentRoute: TESTREGEL_ROOT,
};
export const TESTREGEL_EDIT: AppRoute = {
  navn: 'Endre testregel',
  path: idPath,
  parentRoute: TESTREGEL_ROOT,
};

export const REGELSETT_ROOT: AppRoute = {
  navn: 'Regelsett',
  path: 'regelsett',
  parentRoute: TESTREGEL_ROOT,
};

export const REGELSETT_LIST: AppRoute = {
  navn: 'Regelsett',
  path: listPath,
  parentRoute: REGELSETT_ROOT,
};
export const REGELSETT_CREATE: AppRoute = {
  navn: 'Nytt regelsett',
  path: createPath,
  parentRoute: REGELSETT_ROOT,
};
export const REGELSETT_EDIT: AppRoute = {
  navn: 'Endre regelsett',
  path: idPath,
  parentRoute: REGELSETT_ROOT,
};

export const TestregelRoutes: RouteObject = {
  path: TESTREGEL_ROOT.path,
  element: <TestreglarApp />,
  handle: { name: TESTREGEL_ROOT.navn },
  children: [
    {
      index: true,
      element: <TestregelList />,
    },
    {
      path: createPath,
      element: <TestregelCreate />,
      handle: { name: TESTREGEL_CREATE.navn },
    },
    {
      path: idPath,
      element: <TestregelEdit />,
      loader: async ({ params }) =>
        defer(await getTestregel(Number(params?.id))),
      handle: { name: TESTREGEL_EDIT.navn },
    },
    {
      path: REGELSETT_ROOT.path,
      element: <RegelsettApp />,
      handle: { name: REGELSETT_ROOT.navn },
      children: [
        {
          index: true,
          element: <RegelsettList />,
        },
        {
          path: REGELSETT_CREATE.path,
          handle: { name: REGELSETT_CREATE.navn },
          element: <RegelsettCreate />,
        },
        {
          path: REGELSETT_EDIT.path,
          handle: { name: REGELSETT_EDIT.navn },
          element: <RegelsettEdit />,
        },
      ],
    },
  ],
};
