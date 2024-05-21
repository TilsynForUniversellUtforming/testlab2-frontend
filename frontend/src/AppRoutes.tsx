import AppContainer from '@common/app-container/AppContainer';
import AppErrorBoundary from '@common/error-boundary/AppErrorBoundary';
import Page404 from '@common/Page404';
import { AppRoute } from '@common/util/routeUtils';
import { LOEYSING_ROOT, LoeysingRoutes } from '@loeysingar/LoeysingRoutes';
import { MAALING_ROOT, MaalingRoutes } from '@maaling/MaalingRoutes';
import { TestingRoutes } from '@test/TestingRoutes';
import { TESTREGEL_ROOT, TestregelRoutes } from '@testreglar/TestregelRoutes';
import { VERKSEMD_LIST, VerksemdRoutes } from '@verksemder/VerksemdRoutes';
import { RouteObject } from 'react-router-dom';

import diskusjonImg from './assets/diskusjon.svg';
import mineSakerImg from './assets/mine-saker.svg';
import mineTestarImg from './assets/mine-testar.svg';
import teknikkImg from './assets/teknikk.svg';
import konkurranseImg from './assets/teknikk.svg';
import tilsynImg from './assets/tilsyn.svg';
import { KONTROLL_LISTE, KontrollRoutes } from './kontroll/KontrollRoutes';
import { KRAV_LIST, KravRoutes } from './krav/KravRoutes';
import Oversikt from './oversikt/Oversikt';
import { RESULTAT_ROOT, ResultRoutes } from './resultat/ResultatRoutes';

export const ROOT: AppRoute = {
  navn: 'uu',
  path: '/',
  imgSrc: tilsynImg,
};

export const DISKUSJON_ROOT: AppRoute = {
  navn: 'Diskusjon',
  path: '/',
  parentRoute: ROOT,
  imgSrc: diskusjonImg,
  disabled: true,
};
export const MINE_SAKER_ROOT: AppRoute = {
  navn: 'Mine saker',
  path: '/',
  parentRoute: ROOT,
  imgSrc: mineSakerImg,
  disabled: true,
};
export const MINE_TESTAR_ROOT: AppRoute = {
  navn: 'Mine testar',
  path: '/',
  parentRoute: ROOT,
  imgSrc: mineTestarImg,
  disabled: true,
};

const TEKNIKK_ROOT: AppRoute = {
  navn: 'Teknikk',
  path: '/',
  parentRoute: ROOT,
  imgSrc: teknikkImg,
  disabled: true,
};

export const KONKURRANSE_ROOT: AppRoute = {
  navn: 'Konkurranse',
  path: '/',
  parentRoute: ROOT,
  imgSrc: konkurranseImg,
  disabled: true,
};

export const utval: AppRoute[] = [
  LOEYSING_ROOT,
  VERKSEMD_LIST,
  TESTREGEL_ROOT,
  KRAV_LIST,
  TEKNIKK_ROOT,
];

export const saksbehandling: AppRoute[] = [
  MINE_SAKER_ROOT,
  KONTROLL_LISTE,
  MAALING_ROOT,
];

export const testing: AppRoute[] = [MINE_TESTAR_ROOT, RESULTAT_ROOT];

export const anna: AppRoute[] = [DISKUSJON_ROOT, KONKURRANSE_ROOT];

export const AppRoutes: RouteObject = {
  element: <AppContainer />,
  errorElement: <AppErrorBoundary />,
  handle: { name: 'Heim' },
  children: [
    {
      index: true,
      element: <Oversikt />,
    },
    MaalingRoutes,
    LoeysingRoutes,
    TestregelRoutes,
    VerksemdRoutes,
    KravRoutes,
    TestingRoutes,
    ResultRoutes,
    KontrollRoutes,
    TestingRoutes,
    {
      path: '*',
      element: <Page404 />,
    },
  ],
};
