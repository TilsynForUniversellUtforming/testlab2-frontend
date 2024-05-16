import ErrorCard from '@common/error/ErrorCard';
import { AppRoute, idPath } from '@common/util/routeUtils';
import { getTestResults, listTestgrunnlagForKontroll, } from '@test/api/testing-api';
import TestregelDemoApp from '@test/demo/TestregelDemoApp';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import { ContextKontroll, TestOverviewLoaderResponse } from '@test/types';
import { getInnhaldstypeInTest } from '@test/util/testregelUtils';
import { listInnhaldstype, listTestreglarWithMetadata, } from '@testreglar/api/testreglar-api';
import { defer, Outlet, RouteObject } from 'react-router-dom';

import { fetchKontroll, listSideutvalType } from '../kontroll/kontroll-api';
import { Kontroll } from '../kontroll/types';
import InngaaendeTestApp from './InngaaendeTestApp';
import TestOverview from './test-overview/TestOverview';

export const TEST_ROOT: AppRoute = {
  navn: 'Tester',
  path: 'kontroll-test',
};

export const TEST: AppRoute = {
  navn: 'Test',
  path: idPath,
  parentRoute: TEST_ROOT,
};

export const TEST_LOEYSING_KONTROLL: AppRoute = {
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
        const kontrollId = Number(params?.id);

        if (isNaN(kontrollId) || kontrollId <= 0) {
          throw new Error('Ugyldig kontroll-id');
        }

        const [
          kontrollPromise,
          testgrunnlagPromise,
          sideutvalTypePromise,
          innhaldstypePromise,
          testreglarPromise,
        ] = await Promise.allSettled([
          fetchKontroll(kontrollId),
          listTestgrunnlagForKontroll(kontrollId),
          listSideutvalType(),
          listInnhaldstype(),
          listTestreglarWithMetadata(),
        ]);

        if (testgrunnlagPromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente testgrunnlag');
        }

        if (sideutvalTypePromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente sideutvaltyper');
        }

        if (innhaldstypePromise.status === 'rejected') {
          throw new Error('Kunne ikkje hente innhaldstypar');
        }

        if (kontrollPromise.status === 'rejected') {
          throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
        }

        if (testreglarPromise.status === 'rejected') {
          throw new Error(`Kunne ikkje hente testreglar`);
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

        const loeysingWithSideutvalIds = kontroll.sideutvalList.map(
          (su) => su.loeysingId
        );
        const loeysingWithSideutval =
          kontroll.utval?.loeysingar.filter((l) =>
            loeysingWithSideutvalIds.includes(l.id)
          ) ?? [];

        const kontrollTestregelIdList =
          kontroll.testreglar?.testregelList?.map((tr) => tr.id) ?? [];

        const kontrollTestreglar = testreglarPromise.value.filter((tr) =>
          kontrollTestregelIdList.includes(tr.id)
        );

        const contextKontroll: ContextKontroll = {
          ...kontroll,
          loeysingList: loeysingWithSideutval,
          testregelList: kontrollTestreglar,
        };

        const innhaldstypeList = innhaldstypePromise.value;

        return defer({
          kontroll: contextKontroll,
          testgrunnlag: testgrunnlagPromise.value,
          sideutvalTypeList: sideutvalTypePromise.value,
          innhaldstypeTestingList: getInnhaldstypeInTest(
            kontrollTestreglar,
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
          path: TEST_LOEYSING_KONTROLL.path,
          element: <TestOverviewLoeysing />,
          handle: { name: TEST_LOEYSING_KONTROLL.navn },
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
