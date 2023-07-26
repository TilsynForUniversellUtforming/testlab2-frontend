import './index.scss';
import 'react-router/dist';

import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import appRoutes, { createPath, editPath, idPath } from './common/appRoutes';
import AppErrorBoundary from './common/error-boundary/AppErrorBoundary';
import Breadcrumbs from './common/navigation/breadcrumbs/Breadcrumbs';
import Navigation from './common/navigation/Navigation';
import Page404 from './common/Page404';
import KravApp from './krav/KravApp';
import LoeysingList from './loeysingar/list/LoeysingList';
import LoeysingApp from './loeysingar/LoeysingApp';
import LoeysingCreate from './loeysingar/LoeysingCreate';
import LoeysingEdit from './loeysingar/LoeysingEdit';
import MaalingList from './maaling/list/MaalingList';
import MaalingApp from './maaling/MaalingApp';
import MaalingCreate from './maaling/MaalingCreate';
import MaalingOverviewApp from './maaling/overview/MaalingOverviewApp';
import MaalingOverviewWrapper from './maaling/overview/MaalingOverviewWrapper';
import Oversikt from './oversikt/Oversikt';
import SakList from './sak/list/SakList';
import SakOverview from './sak/overview/SakOverview';
import SakOverviewApp from './sak/overview/SakOverviewApp';
import SakApp from './sak/SakApp';
import SakCreate from './sak/SakCreate';
import SakEdit from './sak/SakEdit';
import KvalitetssikringApp from './tester/sideutval/kvalitetssikring/KvalitetssikringApp';
import SideutvalApp from './tester/sideutval/SideutvalApp';
import TestResultListApp from './tester/testing-list/test-result-list/TestResultListApp';
import TestingListApp from './tester/testing-list/TestingListApp';
import RegelsettApp from './testreglar/regelsett/RegelsettApp';
import RegelsettCreate from './testreglar/regelsett/RegelsettCreate';
import RegelsettEdit from './testreglar/regelsett/RegelsettEdit';
import RegelsettList from './testreglar/regelsett/RegelsettList';
import TestregelCreate from './testreglar/testreglar-liste/TestregelCreate';
import TestregelEdit from './testreglar/testreglar-liste/TestregelEdit';
import TestregelList from './testreglar/testreglar-liste/TestregelList';
import TestreglarApp from './testreglar/TestreglarApp';
import VerksemderApp from './verksemder/VerksemderApp';

const AppContainer = () => (
  <>
    <Navigation />
    <Breadcrumbs />
    <div className="app-container">
      <Outlet />
    </div>
  </>
);

const App = () => {
  const router = createBrowserRouter([
    {
      element: <AppContainer />,
      errorElement: <AppErrorBoundary />,
      handle: { name: 'Heim' },
      children: [
        {
          path: appRoutes.ROOT.path,
          element: <Oversikt />,
        },
        {
          path: appRoutes.SAK_ROOT.path,
          element: <SakApp />,
          handle: { name: appRoutes.SAK_ROOT.navn },
          children: [
            {
              index: true,
              element: <SakList />,
            },
            {
              path: createPath,
              element: <SakCreate />,
              handle: { name: appRoutes.SAK_CREATE.navn },
            },
            {
              path: idPath,
              element: <SakOverviewApp />,
              handle: { name: appRoutes.SAK.navn },
              children: [
                {
                  index: true,
                  element: <SakOverview />,
                },
                {
                  path: editPath,
                  element: <SakEdit />,
                  handle: { name: appRoutes.SAK_EDIT.navn },
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.MAALING_ROOT.path,
          element: <MaalingApp />,
          handle: { name: appRoutes.MAALING_ROOT.navn },
          children: [
            {
              index: true,
              element: <MaalingList />,
            },
            {
              path: createPath,
              element: <MaalingCreate />,
              handle: { name: appRoutes.MAALING_CREATE.navn },
            },
            {
              path: idPath,
              element: <MaalingOverviewApp />,
              handle: { name: appRoutes.MAALING.navn },
              children: [
                {
                  index: true,
                  element: <MaalingOverviewWrapper />,
                },
                {
                  path: appRoutes.TEST_SIDEUTVAL_LIST.path,
                  element: <SideutvalApp />,
                  handle: { name: appRoutes.TEST_SIDEUTVAL_LIST.navn },
                  children: [
                    {
                      path: appRoutes.TEST_CRAWLING_RESULT_LIST.path,
                      element: <KvalitetssikringApp />,
                      handle: {
                        name: appRoutes.TEST_CRAWLING_RESULT_LIST.navn,
                      },
                    },
                  ],
                },
                {
                  path: appRoutes.TEST_TESTING_LIST.path,
                  element: <TestingListApp />,
                  handle: { name: appRoutes.TEST_TESTING_LIST.navn },
                  children: [
                    {
                      path: appRoutes.TEST_RESULT_LIST.path,
                      element: <TestResultListApp />,
                      handle: { name: appRoutes.TEST_RESULT_LIST.navn },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.TESTREGEL_ROOT.path,
          element: <TestreglarApp />,
          handle: { name: appRoutes.TESTREGEL_ROOT.navn },
          children: [
            {
              index: true,
              element: <TestregelList />,
            },
            {
              path: createPath,
              element: <TestregelCreate />,
              handle: { name: appRoutes.TESTREGEL_CREATE.navn },
            },
            {
              path: idPath,
              element: <TestregelEdit />,
              handle: { name: appRoutes.TESTREGEL_EDIT.navn },
            },
            {
              path: appRoutes.REGELSETT_ROOT.path,
              element: <RegelsettApp />,
              handle: { name: appRoutes.REGELSETT_ROOT.navn },
              children: [
                {
                  index: true,
                  element: <RegelsettList />,
                },
                {
                  path: appRoutes.REGELSETT_CREATE.path,
                  handle: { name: appRoutes.REGELSETT_CREATE.navn },
                  element: <RegelsettCreate />,
                },
                {
                  path: appRoutes.REGELSETT_EDIT.path,
                  handle: { name: appRoutes.REGELSETT_EDIT.navn },
                  element: <RegelsettEdit />,
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.VERKSEMD_LIST.path,
          element: <VerksemderApp />,
          handle: { name: appRoutes.VERKSEMD_LIST.navn },
        },
        {
          path: appRoutes.LOEYSING_ROOT.path,
          element: <LoeysingApp />,
          handle: { name: appRoutes.LOEYSING_ROOT.navn },
          children: [
            {
              index: true,
              element: <LoeysingList />,
            },
            {
              path: createPath,
              element: <LoeysingCreate />,
              handle: { name: appRoutes.LOEYSING_CREATE.navn },
            },
            {
              path: idPath,
              element: <LoeysingEdit />,
              handle: { name: appRoutes.LOEYSING_EDIT.navn },
            },
          ],
        },
        {
          path: appRoutes.KRAV_LIST.path,
          handle: { name: appRoutes.KRAV_LIST.navn },
          element: <KravApp />,
        },
        {
          path: '*',
          element: <Page404 />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
