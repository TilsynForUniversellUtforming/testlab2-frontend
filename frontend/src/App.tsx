import React from 'react';
import { Route, Routes } from 'react-router-dom';

import NavBar from './common/navigation/NavBar';
import { Paths } from './common/paths';
import KravApp from './krav/KravApp';
import LoeysingApp from './loeysingar/LoeysingApp';
import Oversikt from './oversikt/Oversikt';
import ResultatApp from './resultat/ResultatApp';
import TestingApp from './testing/TestingApp';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path={Paths.ROOT} element={<Oversikt />} />
        <Route path={Paths.TEST} element={<TestingApp />} />
        <Route path={Paths.KRAV} element={<KravApp />} />
        <Route path={Paths.RESULTAT} element={<ResultatApp />} />
        <Route path={Paths.LOEYSINGAR} element={<LoeysingApp />} />
      </Routes>
    </>
  );
}

export default App;
