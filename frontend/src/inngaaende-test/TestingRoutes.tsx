import { AppRoute, idPath } from '@common/util/routeUtils';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import { Outlet, RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import TestregelDemoApp from './demo/TestregelDemoApp';
import InngaaendeTestApp from './InngaaendeTestApp';
import TestOverview from './test-overview/TestOverview';

export const TEST_ROOT: AppRoute = {
  navn: 'Tester',
  path: 'test',
  imgSrc: nyTestImg,
  disabled: true,
};

export const TEST: AppRoute = {
  navn: 'Test',
  path: idPath,
  parentRoute: TEST_ROOT,
};

export const TEST_LOEYSING: AppRoute = {
  navn: 'Test løysing',
  path: ':loeysingId',
  parentRoute: TEST,
};

export const TEST_LOEYSING_TESTGRUNNLAG: AppRoute = {
  navn: 'Test løysing testgrunnlag',
  path: ':testgrunnlagId',
  parentRoute: TEST_LOEYSING,
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
      element: <InngaaendeTestApp />,
      handle: { name: 'Test' },
      children: [
        {
          index: true,
          element: <TestOverview />,
        },
        {
          path: TEST_LOEYSING.path,
          element: <TestOverviewLoeysing />,
          handle: { name: TEST_LOEYSING.navn },
          children: [
            {
              path: TEST_LOEYSING_TESTGRUNNLAG.path,
              element: <TestOverviewLoeysing />,
              handle: { name: TEST_LOEYSING_TESTGRUNNLAG.navn },
            },
          ],
        },
      ],
    },
    {
      path: TESTREGEL_DEMO.path,
      element: <TestregelDemoApp />,
      handle: { name: 'Demo' },
    },
  ],
};
