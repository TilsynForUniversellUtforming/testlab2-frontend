import {
  AppRoute,
  createPath,
  editPath,
  idPath,
} from '@common/util/routeUtils';
import MaalingList from '@maaling/list/MaalingList';
import MaalingApp from '@maaling/MaalingApp';
import MaalingOverviewApp from '@maaling/overview/MaalingOverviewApp';
import MaalingOverviewWrapper from '@maaling/overview/MaalingOverviewWrapper';
import { RouteObject } from 'react-router-dom';

import maalingImg from '../assets/maalingar.svg';
import KvalitetssikringApp from '../tester/sideutval/kvalitetssikring/KvalitetssikringApp';
import SideutvalApp from '../tester/sideutval/SideutvalApp';
import TestResultList from '../tester/testing-list/test-result-list/TestResultList';
import TestResultListApp from '../tester/testing-list/test-result-list/TestResultListApp';
import ViolationListApp from '../tester/testing-list/test-result-list/ViolationListApp';
import TestingListApp from '../tester/testing-list/TestingListApp';

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
  path: 'testing',
  parentRoute: MAALING,
};

export const TEST_RESULT_LIST: AppRoute = {
  navn: 'Resultat',
  path: ':loeysingId',
  parentRoute: TEST_TESTING_LIST,
};

export const TEST_VIOLATION_LIST: AppRoute = {
  navn: 'Brot',
  path: ':testregelId',
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
