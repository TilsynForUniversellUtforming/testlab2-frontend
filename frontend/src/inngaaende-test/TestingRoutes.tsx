import ErrorCard from '@common/error/ErrorCard';
import { AppRoute, idPath } from '@common/util/routeUtils';
import { getSak } from '@sak/api/sak-api';
import { getTestResults, listTestgrunnlagForSak } from '@test/api/testing-api';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import { TestOverviewLoaderResponse } from '@test/types';
import { getInnhaldstypeInTest } from '@test/util/testregelUtils';
import { listInnhaldstype } from '@testreglar/api/testreglar-api';
import { defer, Outlet, RouteObject } from 'react-router-dom';

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

export const TEST_LOEYSING_TESTGRUNNLAG: AppRoute = {
  navn: 'Test løysing testgrunnlag',
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
      loader: async ({ params }) => {
        const id = Number(params?.id);

        if (isNaN(id) || id <= 0) {
          throw new Error('Ugyldig sak id');
        }

        const [sakResponse, testgrunnlagResponse, innhaldstypeResponse] =
          await Promise.allSettled([
            getSak(id),
            listTestgrunnlagForSak(id),
            listInnhaldstype(),
          ]);

        if (sakResponse.status === 'rejected') {
          throw new Error(`Fann ikkje sak med id ${id}`);
        }

        if (testgrunnlagResponse.status === 'rejected') {
          throw new Error('Kunne ikkje hente testgrunnlag');
        }

        if (innhaldstypeResponse.status === 'rejected') {
          throw new Error('Kunne ikkje hente innhaldstypar');
        }

        const sak = sakResponse.value;
        const innhaldstypeList = innhaldstypeResponse.value;

        return defer({
          sak: sakResponse.value,
          testgrunnlag: testgrunnlagResponse.value,
          innhaldstypeTestingList: getInnhaldstypeInTest(
            sak.testreglar,
            innhaldstypeList
          ),
        });
      },
      children: [
        {
          index: true,
          element: <TestOverview />,
        },
        {
          path: TEST_LOEYSING_TESTGRUNNLAG.path,
          element: <TestOverviewLoeysing />,
          handle: { name: TEST_LOEYSING_TESTGRUNNLAG.navn },
          loader: async ({ params }): Promise<TestOverviewLoaderResponse> => {
            const testResults = await getTestResults(
              Number(params?.testgrunnlagId)
            );
            return { results: testResults };
          },
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
