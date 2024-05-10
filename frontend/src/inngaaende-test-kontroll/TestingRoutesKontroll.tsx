import ErrorCard from '@common/error/ErrorCard';
import { AppRoute, idPath } from '@common/util/routeUtils';
import { getTestResults, listTestgrunnlagForKontroll } from '@test/api/testing-api';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import { TestOverviewLoaderResponse } from '@test/types';
import { innhaldstypeAlle } from '@test/util/testregelUtils';
import { listInnhaldstype } from '@testreglar/api/testreglar-api';
import { defer, Outlet, RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import TestregelDemoApp from './demo/TestregelDemoApp';
import InngaaendeTestApp from './InngaaendeTestApp';
import TestOverview from './test-overview/TestOverview';
import { fetchKontroll, listSideutvalType } from '../kontroll/kontroll-api';
import { Kontroll } from '../kontroll/types';

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

export const TestingRoutesKontroll: RouteObject = {
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
        const kontrollId = Number(params?.id);

        if (isNaN(kontrollId) || kontrollId <= 0) {
          throw new Error('Ugyldig kontroll-id');
        }

        const [kontrollPromise, testgrunnlagPromise, sideutvalTypePromise, innhaldstypePromise] =
          await Promise.allSettled([
            fetchKontroll(kontrollId),
            listTestgrunnlagForKontroll(kontrollId),
            listSideutvalType(),
            listInnhaldstype(),
          ]);


        if (testgrunnlagPromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente testgrunnlag');
        }

        if (sideutvalTypePromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente sideutvaltyper')
        }

        if (innhaldstypePromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente innhaldstypar');
        }


        if (kontrollPromise.status === 'rejected') {
          throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
        }

        const kontrollResponse = kontrollPromise.value;

        if (!kontrollResponse.ok) {
          if (kontrollResponse.status === 404) {
            throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
          } else {
            throw new Error('Klarte ikke å hente kontrollen.');
          }
        }
        const kontroll: Kontroll = await kontrollResponse.json();

        const loeysingWithSideutvalIds = kontroll.sideutvalList.map(su => su.loeysingId);
        const loeysingWithSideutval = kontroll.utval?.loeysingar.filter(l => loeysingWithSideutvalIds.some(lsu => lsu === l.id)) ?? [];

        return defer({
          kontroll: kontroll,
          loeysingWithSideutval: loeysingWithSideutval,
          testgrunnlag: testgrunnlagPromise.value,
          sideutvalType: sideutvalTypePromise.value,
          innhaldstypeTestingList: [
            ...innhaldstypePromise.value,
            innhaldstypeAlle,
          ],
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
