import ErrorCard from '@common/error/ErrorCard';
import { take } from '@common/util/arrayUtils';
import { AppRoute, idPath } from '@common/util/routeUtils';
import {
  createTestResultat,
  deleteTestgrunnlag,
  fetchStyringsdata,
  fetchTestResults,
  listTestgrunnlag,
  postTestgrunnlag,
  updateTestResultat,
} from '@test/api/testing-api';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  Svar,
} from '@test/api/types';
import TestregelDemoApp from '@test/demo/TestregelDemoApp';
import StyringsdataForm from '@test/styringsdata/StyringsdataForm';
import { Styringsdata, StyringsdataLoaderData } from '@test/styringsdata/types';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import { Testgrunnlag, TestOverviewLoaderResponse } from '@test/types';
import {
  getIdFromParams,
  getInnhaldstypeInTest,
} from '@test/util/testregelUtils';
import {
  listInnhaldstype,
  listTestreglarWithMetadata,
} from '@testreglar/api/testreglar-api';
import { defer, Outlet, RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import { fetchKontroll, listSideutvalType } from '../kontroll/kontroll-api';
import { Kontroll } from '../kontroll/types';
import InngaaendeTestApp from './InngaaendeTestApp';
import TestOverview, {
  TestOverviewLoaderData,
} from './test-overview/TestOverview';

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

export const TEST_STYRINGSDATA: AppRoute = {
  navn: 'Styringsdata for løysing',
  path: ':loeysingId/styringsdata',
  parentRoute: TEST,
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

function finnSvarTilNyttResultat(resultat: ResultatManuellKontroll): Svar[] {
  if (!resultat.elementOmtale) {
    return [];
  }

  const index = resultat.svar.findIndex(
    (s) => s.svar === resultat.elementOmtale
  );
  if (index === -1) {
    return [];
  }
  return take(resultat.svar, index + 1);
}

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
          sideutvalTypePromise,
          innhaldstypePromise,
          testreglarPromise,
        ] = await Promise.allSettled([
          fetchKontroll(kontrollId),
          listSideutvalType(),
          listInnhaldstype(),
          listTestreglarWithMetadata(),
        ]);

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

        const kontrollTestregelIdList =
          kontroll.testreglar?.testregelList?.map((tr) => tr.id) ?? [];

        const kontrollTestreglar = testreglarPromise.value.filter((tr) =>
          kontrollTestregelIdList.includes(tr.id)
        );

        const innhaldstypeList = innhaldstypePromise.value;
        return defer({
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
          loader: async ({ params }): Promise<TestOverviewLoaderData> => {
            const kontrollId = Number(params?.id);
            const [kontrollPromise, testgrunnlagPromise] =
              await Promise.allSettled([
                fetchKontroll(kontrollId),
                listTestgrunnlag(kontrollId),
              ]);

            if (testgrunnlagPromise.status === 'rejected') {
              throw new Error(`Kunne ikkje hente testgrunnlag`);
            }

            if (kontrollPromise.status === 'rejected') {
              throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
            }

            const kontrollResponse = kontrollPromise.value;

            if (!kontrollResponse.ok) {
              if (kontrollResponse.status === 404) {
                throw new Error(
                  'Det finnes ikke en kontroll med id ' + kontrollId
                );
              } else {
                throw new Error('Klarte ikke å hente kontrollen.');
              }
            }
            const kontroll: Kontroll = await kontrollResponse.json();
            const testgrunnlag = testgrunnlagPromise.value;

            const resultater: ResultatManuellKontroll[][] = await Promise.all(
              testgrunnlag.map((t) => fetchTestResults(t.id))
            );

            const loeysingWithSideutvalIds = kontroll.sideutvalList.map(
              (su) => su.loeysingId
            );
            const loeysingWithSideutval =
              kontroll.utval?.loeysingar.filter((l) =>
                loeysingWithSideutvalIds.includes(l.id)
              ) ?? [];

            return {
              loeysingList: loeysingWithSideutval,
              resultater: resultater.flat(),
              testgrunnlag,
            };
          },
          action: async ({ request }) => {
            switch (request.method) {
              case 'POST': {
                const { nyttTestgrunnlag, resultater } = await request.json();
                const opprettetTestgrunnlag =
                  await postTestgrunnlag(nyttTestgrunnlag);

                const resultaterPromises = resultater.map(
                  async (r: ResultatManuellKontroll) => {
                    const nyttResultat: CreateTestResultat = {
                      testgrunnlagId: opprettetTestgrunnlag.id,
                      loeysingId: r.loeysingId,
                      testregelId: r.testregelId,
                      sideutvalId: r.sideutvalId,
                    };
                    const testResultat = await createTestResultat(nyttResultat);
                    const svar = finnSvarTilNyttResultat(r);
                    const medSvar = { ...testResultat, svar };
                    await updateTestResultat(medSvar);
                  }
                );
                return await Promise.all(resultaterPromises);
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
          loader: async ({ params }): Promise<TestOverviewLoaderResponse> => {
            const kontrollId = getIdFromParams(params?.id);
            const testgrunnlagId = getIdFromParams(params?.testgrunnlagId);
            const loeysingId = getIdFromParams(params?.loeysingId);

            const [kontrollPromise, testResults, testreglarPromise] =
              await Promise.allSettled([
                fetchKontroll(kontrollId),
                fetchTestResults(testgrunnlagId),
                listTestreglarWithMetadata(),
              ]);

            if (testResults.status === 'rejected') {
              throw new Error(
                `Kunne ikkje hente testresutlat for id ${testgrunnlagId}`
              );
            }

            if (testreglarPromise.status === 'rejected') {
              throw new Error(`Kunne ikkje hente testreglar`);
            }

            if (kontrollPromise.status === 'rejected') {
              throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
            }

            const kontrollResponse = kontrollPromise.value;

            if (!kontrollResponse.ok) {
              if (kontrollResponse.status === 404) {
                throw new Error(
                  'Det finnes ikke en kontroll med id ' + kontrollId
                );
              } else {
                throw new Error('Klarte ikke å hente kontrollen.');
              }
            }
            const kontroll: Kontroll = await kontrollResponse.json();

            const testResultsForLoeysing = testResults.value.filter(
              (tr) => tr.loeysingId === loeysingId
            );
            const sideutvalForLoeysing = kontroll.sideutvalList.filter(
              (su) => su.loeysingId === loeysingId
            );
            const kontrollTestregelIdList =
              kontroll.testreglar?.testregelList?.map((tr) => tr.id) ?? [];

            const kontrollTestreglar = testreglarPromise.value.filter((tr) =>
              kontrollTestregelIdList.includes(tr.id)
            );

            const activeLoeysing = kontroll.utval?.loeysingar?.find(
              (l) => l.id === loeysingId
            );

            if (!activeLoeysing) {
              throw new Error(`Ugyldig løysing for id ${loeysingId}`);
            }

            return {
              testResultatForLoeysing: testResultsForLoeysing,
              sideutvalForLoeysing: sideutvalForLoeysing,
              testreglarForLoeysing: kontrollTestreglar,
              activeLoeysing: activeLoeysing,
              kontrollTitle: kontroll.tittel,
            };
          },
        },
        {
          path: TEST_STYRINGSDATA.path,
          element: <StyringsdataForm />,
          handle: { name: TEST_STYRINGSDATA.navn },
          action: async ({ request }) => {
            const styringsdata = (await request.json()) as Styringsdata;
            console.log(styringsdata);
            return null;
          },
          loader: async ({ params }): Promise<StyringsdataLoaderData> =>
            fetchStyringsdata(
              getIdFromParams(params?.id),
              getIdFromParams(params?.loeysingId)
            ),
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
