import './index.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import Navigation from './common/navigation/Navigation';
import routes from './common/routes';
import DiskusjonApp from './diskusjon/DiskusjonApp';
import KravApp from './krav/KravApp';
import LoeysingApp from './loeysingar/LoeysingApp';
import MaalingApp from './maaling/MaalingApp';
import MineTesterApp from './mine-tester/MineTesterApp';
import Oversikt from './oversikt/Oversikt';
import QualWebApp from './qualweb/QualWebApp';
import ResultatApp from './resultat/ResultatApp';
import SakerApp from './saker/SakerApp';
import TeknikkarApp from './teknikkar/TeknikkarApp';
import TesterApp from './tester/TesterApp';
import CreateRegelsett from './testreglar/regelsett/CreateRegelsett';
import Regelsett from './testreglar/regelsett/Regelsett';
import RegelsettApp from './testreglar/regelsett/RegelsettApp';
import Testreglar from './testreglar/testreglar-liste/Testreglar';
import TestreglarApp from './testreglar/TestreglarApp';
import VerksemderApp from './verksemder/VerksemderApp';

function App() {
  return (
    <>
      <Navigation />
      <Container className="app">
        <Routes>
          <Route path={routes.ROOT.path} element={<Oversikt />} />
          <Route path={routes.SAKER.path} element={<SakerApp />} />
          <Route path={routes.MAALING.path} element={<MaalingApp />} />
          <Route path={routes.TESTREGLAR.path} element={<TestreglarApp />}>
            <Route index element={<Testreglar />} />
            <Route path={routes.REGELSETT.path} element={<RegelsettApp />}>
              <Route index element={<Regelsett />} />
              <Route
                path={routes.NYTT_REGELSETT.path}
                element={<CreateRegelsett />}
              />
            </Route>
          </Route>
          <Route path={routes.VERKSEMDER.path} element={<VerksemderApp />} />
          <Route path={routes.LOEYSINGAR.path} element={<LoeysingApp />} />
          <Route path={routes.KRAV.path} element={<KravApp />} />
          <Route path={routes.TEKNIKKAR.path} element={<TeknikkarApp />} />
          <Route path={routes.DISKUSJON.path} element={<DiskusjonApp />} />
          <Route path={routes.RESULTAT.path} element={<ResultatApp />} />
          <Route path={routes.TESTER.path} element={<TesterApp />} />
          <Route path={routes.MINE_TESTER.path} element={<MineTesterApp />} />
          <Route path={routes.QUALWEB.path} element={<QualWebApp />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
