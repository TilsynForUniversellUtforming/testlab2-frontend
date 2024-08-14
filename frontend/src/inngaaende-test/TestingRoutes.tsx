import ErrorCard from '@common/error/ErrorCard';
import { take } from '@common/util/arrayUtils';
import { AppRoute, idPath } from '@common/util/routeUtils';
import {
  createStyringsdata,
  updateStyringsdata,
} from '@test/api/styringsdata-api';
import {
  createTestResultat,
  deleteTestgrunnlag,
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
import { Styringsdata } from '@test/styringsdata/types';
import TestOverviewLoeysing from '@test/test-overview/loeysing-test/TestOverviewLoeysing';
import {
  styringsdataLoader,
  testLoader,
  testOverviewLoader,
  testOverviewLoeysingLoader,
} from '@test/TestingRoutes.loader';
import { Testgrunnlag } from '@test/types';
import { Outlet, redirect, RouteObject } from 'react-router-dom';

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
      loader: testLoader,
      children: [
        {
          index: true,
          element: <TestOverview />,
          loader: testOverviewLoader,
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
          loader: testOverviewLoeysingLoader,
        },
        {
          path: TEST_STYRINGSDATA.path,
          element: <StyringsdataForm />,
          handle: { name: TEST_STYRINGSDATA.navn },
          action: async ({ request }) => {
            const formData = (await request.json()) as Styringsdata;
            switch (request.method) {
              case 'POST': {
                const styringsdata = await createStyringsdata(formData);
                return redirect(`?styringsdataId=${styringsdata.id}`);
              }
              case 'PUT': {
                return await updateStyringsdata(formData);
              }
            }
          },
          loader: styringsdataLoader,
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
