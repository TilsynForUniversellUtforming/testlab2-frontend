import './index.scss';

import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import appRoutes, { createPath, editPath, idPath } from './common/appRoutes';
import AppErrorBoundary from './common/error-boundary/AppErrorBoundary';
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
import MaalingOverview from './maaling/overview/MaalingOverview';
import MaalingOverviewApp from './maaling/overview/MaalingOverviewApp';
import Oversikt from './oversikt/Oversikt';
import SakList from './sak/list/SakList';
import SakOverview from './sak/overview/SakOverview';
import SakOverviewApp from './sak/overview/SakOverviewApp';
import SakApp from './sak/SakApp';
import SakCreate from './sak/SakCreate';
import SakEdit from './sak/SakEdit';
import KvalitetssikringApp from './tester/kvalitetssikring/KvalitetssikringApp';
import SideutvalApp from './tester/sideutval/SideutvalApp';
import TestResultListApp from './tester/test-result-list/TestResultListApp';
import TesterApp from './tester/TesterApp';
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
      children: [
        {
          path: appRoutes.ROOT.path,
          element: <Oversikt />,
        },
        {
          path: appRoutes.SAK_LIST.path,
          element: <SakList />,
        },
        {
          path: appRoutes.SAK_ROOT.path,
          element: <SakApp />,
          children: [
            {
              path: createPath,
              element: <SakCreate />,
            },
            {
              path: idPath,
              element: <SakOverviewApp />,
              children: [
                {
                  index: true,
                  element: <SakOverview />,
                },
                {
                  path: editPath,
                  element: <SakEdit />,
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.MAALING_LIST.path,
          element: <MaalingList />,
        },
        {
          path: appRoutes.MAALING_ROOT.path,
          element: <MaalingApp />,
          children: [
            {
              path: createPath,
              element: <MaalingCreate />,
            },
            {
              path: idPath,
              element: <MaalingOverviewApp />,
              children: [
                {
                  index: true,
                  element: <MaalingOverview />,
                },
                {
                  path: editPath,
                  element: <SakEdit />,
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.TESTREGEL_ROOT.path,
          element: <TestreglarApp />,
          children: [
            {
              index: true,
              element: <TestregelList />,
            },
            {
              path: createPath,
              element: <TestregelCreate />,
            },
            {
              path: idPath,
              element: <TestregelEdit />,
            },
            {
              path: appRoutes.REGELSETT_ROOT.path,
              element: <RegelsettApp />,
              children: [
                {
                  index: true,
                  element: <RegelsettList />,
                },
                {
                  path: appRoutes.REGELSETT_CREATE.path,
                  element: <RegelsettCreate />,
                },
                {
                  path: appRoutes.REGELSETT_EDIT.path,
                  element: <RegelsettEdit />,
                },
              ],
            },
          ],
        },
        {
          path: appRoutes.VERKSEMD_LIST.path,
          element: <VerksemderApp />,
        },
        {
          path: appRoutes.LOEYSING_ROOT.path,
          element: <LoeysingApp />,
          children: [
            {
              index: true,
              element: <LoeysingList />,
            },
            {
              path: createPath,
              element: <LoeysingCreate />,
            },
            {
              path: idPath,
              element: <LoeysingEdit />,
            },
          ],
        },
        {
          path: appRoutes.KRAV_LIST.path,
          element: <KravApp />,
        },
        {
          path: appRoutes.TEST.path,
          element: <TesterApp />,
          children: [
            {
              path: appRoutes.TEST_SIDEUTVAL_LIST.path,
              element: <SideutvalApp />,
            },
            {
              path: appRoutes.TEST_CRAWLING_RESULT_LIST.path,
              element: <KvalitetssikringApp />,
            },
            {
              path: appRoutes.TEST_TESTING_LIST.path,
              element: <TestingListApp />,
            },
            {
              path: appRoutes.TEST_RESULT_LIST.path,
              element: <TestResultListApp />,
            },
          ],
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
