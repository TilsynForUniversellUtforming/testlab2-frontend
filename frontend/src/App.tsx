import './index.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import appRoutes, { createPath, editPath, idPath } from './common/appRoutes';
import IkkeFunnet from './common/IkkeFunnet';
import Navigation from './common/navigation/Navigation';
import KravApp from './krav/KravApp';
import LoeysingApp from './loeysingar/LoeysingApp';
import MaalingList from './maaling/list/MaalingList';
import MaalingApp from './maaling/MaalingApp';
import Oversikt from './oversikt/Oversikt';
import SakList from './sak/list/SakList';
import Sak from './sak/Sak';
import SakApp from './sak/SakApp';
import SakCreate from './sak/SakCreate';
import SakEdit from './sak/SakEdit';
import CrawlingApp from './tester/crawling/CrawlingApp';
import KvalitetssikringApp from './tester/kvalitetssikring/KvalitetssikringApp';
import TestResultListApp from './tester/test-result-list/TestResultListApp';
import TesterApp from './tester/TesterApp';
import CreateRegelsett from './testreglar/regelsett/CreateRegelsett';
import EditRegelsett from './testreglar/regelsett/EditRegelsett';
import Regelsett from './testreglar/regelsett/Regelsett';
import RegelsettApp from './testreglar/regelsett/RegelsettApp';
import CreateTestregel from './testreglar/testreglar-liste/CreateTestregel';
import EditTestreglar from './testreglar/testreglar-liste/EditTestreglar';
import Testreglar from './testreglar/testreglar-liste/Testreglar';
import TestreglarApp from './testreglar/TestreglarApp';
import VerksemderApp from './verksemder/VerksemderApp';

function App() {
  return (
    <>
      <Navigation />
      <Container style={{ paddingTop: '1rem' }}>
        <Routes>
          <Route path={appRoutes.ROOT.path} element={<Oversikt />} />
          <Route path={appRoutes.SAK_LIST.path} element={<SakList />} />
          <Route path={appRoutes.SAK_ROOT.path} element={<SakApp />}>
            <Route path={createPath} element={<SakCreate />} />
            <Route path={idPath} element={<Sak />}>
              <Route path={editPath} element={<SakEdit />} />
            </Route>
          </Route>
          <Route path={appRoutes.MAALING_LIST.path} element={<MaalingApp />}>
            <Route index element={<MaalingList />} />
          </Route>
          <Route
            path={appRoutes.TESTREGEL_LIST.path}
            element={<TestreglarApp />}
          >
            <Route index element={<Testreglar />} />
            <Route
              path={appRoutes.TESTREGEL_CREATE.path}
              element={<CreateTestregel />}
            />
            <Route
              path={appRoutes.TESTREGEL_EDIT.path}
              element={<EditTestreglar />}
            />
            <Route
              path={appRoutes.REGELSETT_LIST.path}
              element={<RegelsettApp />}
            >
              <Route index element={<Regelsett />} />
              <Route
                path={appRoutes.REGELSETT_CREATE.path}
                element={<CreateRegelsett />}
              />
              <Route
                path={appRoutes.REGELSETT_EDIT.path}
                element={<EditRegelsett />}
              />
            </Route>
          </Route>
          <Route
            path={appRoutes.VERKSEMD_LIST.path}
            element={<VerksemderApp />}
          />
          <Route
            path={appRoutes.LOEYSING_LIST.path}
            element={<LoeysingApp />}
          />
          <Route path={appRoutes.KRAV_LIST.path} element={<KravApp />} />
          <Route path={appRoutes.TEST.path} element={<TesterApp />}>
            <Route
              path={appRoutes.TEST_CRAWLING_LIST.path}
              element={<CrawlingApp />}
            />
            <Route
              path={appRoutes.TEST_CRAWLING_RESULT_LIST.path}
              element={<KvalitetssikringApp />}
            />
            <Route
              path={appRoutes.TEST_TESTING_LIST.path}
              element={<>TESTING</>}
            />
            <Route
              path={appRoutes.TEST_RESULT_LIST.path}
              element={<TestResultListApp />}
            />
          </Route>
          <Route path="*" element={<IkkeFunnet />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
