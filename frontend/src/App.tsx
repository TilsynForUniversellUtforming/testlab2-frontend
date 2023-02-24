import './index.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import appRoutes from './common/appRoutes';
import IkkeFunnet from './common/IkkeFunnet';
import Navigation from './common/navigation/Navigation';
import DiskusjonApp from './diskusjon/DiskusjonApp';
import KravApp from './krav/KravApp';
import LoeysingApp from './loeysingar/LoeysingApp';
import MaalingList from './maaling/maaling-list/MaalingList';
import MaalingApp from './maaling/MaalingApp';
import MineTesterApp from './mine-tester/MineTesterApp';
import Oversikt from './oversikt/Oversikt';
import QualWebApp from './qualweb/QualWebApp';
import ResultatApp from './resultat/ResultatApp';
import SakerApp from './saker/SakerApp';
import TeknikkarApp from './teknikkar/TeknikkarApp';
import CrawlingApp from './tester/crawling/CrawlingApp';
import KvalitetssikringApp from './tester/kvalitetssikring/KvalitetssikringApp';
import LoeysingSelectionApp from './tester/loeysingar/LoeysingSelectionApp';
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
      <Container className="app">
        <Routes>
          <Route path={appRoutes.ROOT.path} element={<Oversikt />} />
          <Route path={appRoutes.SAKER.path} element={<SakerApp />} />
          <Route path={appRoutes.MAALING.path} element={<MaalingApp />}>
            <Route index element={<MaalingList />} />
          </Route>
          <Route path={appRoutes.TESTREGEL.path} element={<TestreglarApp />}>
            <Route index element={<Testreglar />} />
            <Route
              path={appRoutes.CREATE_TESTREGEL.path}
              element={<CreateTestregel />}
            />
            <Route
              path={appRoutes.EDIT_TESTREGEL.path}
              element={<EditTestreglar />}
            />
            <Route path={appRoutes.REGELSETT.path} element={<RegelsettApp />}>
              <Route index element={<Regelsett />} />
              <Route
                path={appRoutes.CREATE_REGELSETT.path}
                element={<CreateRegelsett />}
              />
              <Route
                path={appRoutes.EDIT_REGELSETT.path}
                element={<EditRegelsett />}
              />
            </Route>
          </Route>
          <Route path={appRoutes.VERKSEMDER.path} element={<VerksemderApp />} />
          <Route path={appRoutes.LOEYSINGAR.path} element={<LoeysingApp />} />
          <Route path={appRoutes.KRAV.path} element={<KravApp />} />
          <Route path={appRoutes.TEKNIKKAR.path} element={<TeknikkarApp />} />
          <Route path={appRoutes.DISKUSJON.path} element={<DiskusjonApp />} />
          <Route path={appRoutes.RESULTAT.path} element={<ResultatApp />} />
          <Route path={appRoutes.CREATE_TEST.path} element={<TesterApp />}>
            <Route index element={<LoeysingSelectionApp />} />
            <Route
              path={appRoutes.EDIT_TEST.path}
              element={<LoeysingSelectionApp />}
            />
            <Route
              path={appRoutes.CRAWLING_TEST.path}
              element={<CrawlingApp />}
            />
            <Route
              path={appRoutes.KVALITETSSIKRING_TEST.path}
              element={<KvalitetssikringApp />}
            />
            <Route path={appRoutes.TESTING_TEST.path} element={<>TESTING</>} />
            <Route
              path={appRoutes.RESULTAT_TEST.path}
              element={<TestResultListApp />}
            />
          </Route>
          <Route
            path={appRoutes.MINE_TESTER.path}
            element={<MineTesterApp />}
          />
          <Route path={appRoutes.QUALWEB.path} element={<QualWebApp />} />
          <Route path="*" element={<IkkeFunnet />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
