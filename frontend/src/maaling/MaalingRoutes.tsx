import {
  AppRoute,
  createPath,
  editPath,
  idPath,
} from '@common/util/routeUtils';
import MaalingList from '@maaling/list/MaalingList';
import MaalingApp from '@maaling/MaalingApp';
import MaalingCreate from '@maaling/MaalingCreate';
import MaalingOverviewApp from '@maaling/overview/MaalingOverviewApp';
import MaalingOverviewWrapper from '@maaling/overview/MaalingOverviewWrapper';
import KvalitetssikringApp from '@maaling/resultat/sideutval/kvalitetssikring/KvalitetssikringApp';
import SideutvalApp from '@maaling/resultat/sideutval/SideutvalApp';
import TestResultList from '@maaling/resultat/testing-list/test-result-list/TestResultList';
import TestResultListApp from '@maaling/resultat/testing-list/test-result-list/TestResultListApp';
import ViolationListApp from '@maaling/resultat/testing-list/test-result-list/ViolationListApp';
import TestingListApp from '@maaling/resultat/testing-list/TestingListApp';
import { RouteObject } from 'react-router-dom';

import maalingImg from '../assets/maalingar.svg';

export const MAALING_ROOT: AppRoute = {
  navn: 'Målingar',
  path: 'maaling',
  imgSrc: maalingImg,
};

export const MAALING: AppRoute = {
  navn: 'Måling',
  path: idPath,
  parentRoute: MAALING_ROOT,
};

export const MAALING_CREATE: AppRoute = {
  navn: 'Ny måling',
  path: createPath,
  parentRoute: MAALING_ROOT,
};

export const MAALING_EDIT: AppRoute = {
  navn: 'Endre måling',
  path: editPath,
  parentRoute: MAALING_ROOT,
};

export const TEST_SIDEUTVAL_LIST: AppRoute = {
  navn: 'Sideutval',
  path: 'sideutval',
  parentRoute: MAALING,
};

export const TEST_CRAWLING_RESULT_LIST: AppRoute = {
  navn: 'Kvalitetssikring',
  path: ':loeysingId',
  parentRoute: TEST_SIDEUTVAL_LIST,
};

export const TEST_TESTING_LIST: AppRoute = {
  navn: 'Tester',
  path: 'test-list',
  parentRoute: MAALING,
};

export const TEST_RESULT_LIST: AppRoute = {
  navn: 'Resultat',
  path: ':loeysingId',
  parentRoute: TEST_TESTING_LIST,
};

export const TEST_VIOLATION_LIST: AppRoute = {
  navn: 'Brot',
  path: ':testregelNoekkel',
  parentRoute: TEST_TESTING_LIST,
};

export const MaalingRoutes: RouteObject = {
  path: MAALING_ROOT.path,
  element: <MaalingApp />,
  handle: { name: MAALING_ROOT.navn },
  children: [
    {
      index: true,
      element: <MaalingList />,
    },
    {
      path: MAALING_CREATE.path,
      element: <MaalingCreate />,
      handle: {
        name: MAALING_CREATE.navn,
      },
    },
    {
      path: idPath,
      element: <MaalingOverviewApp />,
      handle: { name: MAALING.navn },
      children: [
        {
          index: true,
          element: <MaalingOverviewWrapper />,
        },
        {
          path: TEST_SIDEUTVAL_LIST.path,
          element: <SideutvalApp />,
          handle: { name: TEST_SIDEUTVAL_LIST.navn },
          children: [
            {
              path: TEST_CRAWLING_RESULT_LIST.path,
              element: <KvalitetssikringApp />,
              handle: {
                name: TEST_CRAWLING_RESULT_LIST.navn,
              },
            },
          ],
        },
        {
          path: TEST_TESTING_LIST.path,
          element: <TestingListApp />,
          handle: { name: TEST_TESTING_LIST.navn },
          children: [
            {
              path: TEST_RESULT_LIST.path,
              element: <TestResultListApp />,
              handle: { name: TEST_RESULT_LIST.navn },
              children: [
                {
                  index: true,
                  element: <TestResultList />,
                },
                {
                  path: TEST_VIOLATION_LIST.path,
                  element: <ViolationListApp />,
                  handle: { name: TEST_VIOLATION_LIST.navn },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
