import React from 'react';
import { Route, Routes } from 'react-router-dom';

import NavBar from './common/navigation/NavBar';
import paths from './common/paths';
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
import TestreglarApp from './testreglar/TestreglarApp';
import VerksemderApp from './verksemder/VerksemderApp';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path={paths.ROOT.path} element={<Oversikt />} />
        <Route path={paths.SAKER.path} element={<SakerApp />} />
        <Route path={paths.MAALING.path} element={<MaalingApp />} />
        <Route path={paths.TESTREGLAR.path} element={<TestreglarApp />} />
        <Route path={paths.VERKSEMDER.path} element={<VerksemderApp />} />
        <Route path={paths.LOEYSINGAR.path} element={<LoeysingApp />} />
        <Route path={paths.KRAV.path} element={<KravApp />} />
        <Route path={paths.TEKNIKKAR.path} element={<TeknikkarApp />} />
        <Route path={paths.DISKUSJON.path} element={<DiskusjonApp />} />
        <Route path={paths.RESULTAT.path} element={<ResultatApp />} />
        <Route path={paths.TESTER.path} element={<TesterApp />} />
        <Route path={paths.MINE_TESTER.path} element={<MineTesterApp />} />
        <Route path={paths.QUALWEB.path} element={<QualWebApp />} />
      </Routes>
    </>
  );
}

export default App;
