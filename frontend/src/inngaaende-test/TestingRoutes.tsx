import ErrorCard from '@common/error/ErrorCard';
import { AppRoute, idPath } from '@common/util/routeUtils';
import { createRetest, deleteTestgrunnlag } from '@test/api/testing-api';
import { RetestRequest } from '@test/api/types';
import TestregelDemoApp from '@test/demo/TestregelDemoApp';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import {
  testLoader,
  testOverviewLoader,
  testOverviewLoeysingLoader,
} from '@test/TestingRoutes.loader';
import { Testgrunnlag } from '@test/types';
import { Outlet, RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import InngaaendeTestApp from './InngaaendeTestApp';
import TestOverview from './test-overview/TestOverview';

export const TEST_ROOT: AppRoute = {
  navn: 'Tester',
  path: 'kontroll-test',
  imgSrc: nyTestImg,
  disabled: true,
};

export const TEST: AppRoute = {
  navn: 'Test',
  path: idPath,
  parentRoute: TEST_ROOT,
};

export const TEST_LOEYSING_KONTROLL: AppRoute = {
  navn: 'Test løysing',
  path: ':loeysingId/:testgrunnlagId',
  parentRoute: TEST,
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
      errorElement: <ErrorCard />,
      loader: testLoader,
      children: [
        {
          index: true,
          element: <TestOverview />,
          loader: testOverviewLoader,
          action: async ({ request }) => {
            switch (request.method) {
              case 'POST': {
                const retestRequest = (await request.json()) as RetestRequest;
                return await createRetest(retestRequest);
              }
              case 'DELETE': {
                const testgrunnlag: Testgrunnlag = await request.json();
                return await deleteTestgrunnlag(testgrunnlag);
              }
            }
          },
        },
        {
          path: TEST_LOEYSING_KONTROLL.path,
          element: <TestOverviewLoeysing />,
          handle: { name: TEST_LOEYSING_KONTROLL.navn },
          loader: testOverviewLoeysingLoader,
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
