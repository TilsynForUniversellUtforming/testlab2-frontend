import { AppRoute, idPath } from '@common/util/routeUtils';
import { Outlet, RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import TestregelDemoApp from './demo/TestregelDemoApp';
import ManualTest from './ManualTest';

export const TEST_ROOT: AppRoute = {
  navn: 'Ny test',
  path: 'test',
  imgSrc: nyTestImg,
  disabled: true,
};

export const TEST: AppRoute = {
  navn: 'Test',
  path: idPath,
  parentRoute: TEST_ROOT,
};

export const TESTREGEL_DEMO: AppRoute = {
  navn: 'Demo',
  path: `demo/${idPath}`,
  parentRoute: TEST_ROOT,
};

export const TestingRoutes: RouteObject = {
  path: TEST_ROOT.path,
  handle: { name: TEST_ROOT.navn },
  element: <Outlet />,
  children: [
    {
      path: TEST.path,
      element: <ManualTest />,
      handle: { name: 'Test' },
    },
    {
      path: TESTREGEL_DEMO.path,
      element: <TestregelDemoApp />,
      handle: { name: 'Demo' },
    },
  ],
};
