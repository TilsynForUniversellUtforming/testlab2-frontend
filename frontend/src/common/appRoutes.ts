import diskusjonImg from '../assets/diskusjon.svg';
import kravImg from '../assets/krav.svg';
import loeysingImg from '../assets/loeysingar.svg';
import maalingImg from '../assets/maalingar.svg';
import mineSakerImg from '../assets/mine-saker.svg';
import mineTestarImg from '../assets/mine-testar.svg';
import nySakImg from '../assets/ny_sak.svg';
import nyTestImg from '../assets/ny_test.svg';
import resultatImg from '../assets/resultat.svg';
import sakerImg from '../assets/saker.svg';
import teknikkImg from '../assets/teknikk.svg';
import konkurranseImg from '../assets/teknikk.svg';
import testingImg from '../assets/testreglar.svg';
import verksemderImg from '../assets/verksemder.svg';

export const createPath = 'ny';
export const idPath = ':id';
export const editPath = 'endre';
export const listPath = 'liste';

export type AppRoute = {
  navn: string;
  path: string;
  imgSrc?: string;
  parentRoute?: AppRoute;
  disabled?: boolean;
};

interface IRoutes {
  ROOT: AppRoute;
  VERKSEMD_LIST: AppRoute;
  VERKSEMD_CREATE: AppRoute;
  VERKSEMD_EDIT: AppRoute;
  KRAV_LIST: AppRoute;
  KRAV_CREATE: AppRoute;
  KRAV_EDIT: AppRoute;

  SAK_ROOT: AppRoute;
  SAK: AppRoute;
  SAK_CREATE: AppRoute;
  SAK_EDIT: AppRoute;

  MAALING_ROOT: AppRoute;
  MAALING: AppRoute;
  MAALING_CREATE: AppRoute;
  MAALING_EDIT: AppRoute;

  LOEYSING_ROOT: AppRoute;
  LOEYSING_LIST: AppRoute;
  LOEYSING_CREATE: AppRoute;
  LOEYSING_EDIT: AppRoute;

  TESTREGEL_ROOT: AppRoute;
  TESTREGEL_LIST: AppRoute;
  TESTREGEL_CREATE: AppRoute;
  TESTREGEL_EDIT: AppRoute;

  REGELSETT_ROOT: AppRoute;
  REGELSETT_LIST: AppRoute;
  REGELSETT_CREATE: AppRoute;
  REGELSETT_EDIT: AppRoute;

  TEST: AppRoute;
  TEST_SIDEUTVAL_LIST: AppRoute;
  TEST_CRAWLING_RESULT_LIST: AppRoute;
  TEST_TESTING_LIST: AppRoute;
  TEST_RESULT_LIST: AppRoute;

  DISKUSJON_ROOT: AppRoute;
  MINE_SAKER_ROOT: AppRoute;
  MINE_TESTAR_ROOT: AppRoute;
  NY_TEST_ROOT: AppRoute;
  RESULTAT_ROOT: AppRoute;
  TEKNIKK_ROOT: AppRoute;
  KONKURRANSE_ROOT: AppRoute;
}

const ROOT = {
  navn: 'uu',
  path: '/',
};
const SAK_ROOT = {
  navn: 'Saker',
  path: 'sak',
  imgSrc: sakerImg,
};
const SAK = {
  navn: 'Sak',
  path: idPath,
  parentRoute: SAK_ROOT,
};
const SAK_CREATE = {
  navn: 'Ny sak',
  path: createPath,
  parentRoute: SAK_ROOT,
  imgSrc: nySakImg,
};
const SAK_EDIT = {
  navn: 'Endre sak',
  path: editPath,
  parentRoute: SAK_ROOT,
};
const MAALING_ROOT = {
  navn: 'Målingar',
  path: 'maaling',
  imgSrc: maalingImg,
};
const MAALING = {
  navn: 'Måling',
  path: idPath,
  parentRoute: MAALING_ROOT,
};
const MAALING_CREATE = {
  navn: 'Ny måling',
  path: createPath,
  parentRoute: MAALING_ROOT,
};
const MAALING_EDIT = {
  navn: 'Endre måling',
  path: editPath,
  parentRoute: MAALING_ROOT,
};

const TESTREGEL_ROOT = {
  navn: 'Testreglar',
  path: 'testreglar',
  imgSrc: testingImg,
};

const TESTREGEL_LIST = {
  navn: 'Testreglar',
  path: listPath,
  parentRoute: TESTREGEL_ROOT,
};

const TESTREGEL_CREATE = {
  navn: 'Ny testregel',
  path: createPath,
  parentRoute: TESTREGEL_ROOT,
};
const TESTREGEL_EDIT = {
  navn: 'Endre testregel',
  path: idPath,
  parentRoute: TESTREGEL_ROOT,
};

const REGELSETT_ROOT = {
  navn: 'Regelsett',
  path: 'regelsett',
  parentRoute: TESTREGEL_ROOT,
};

const REGELSETT_LIST = {
  navn: 'Regelsett',
  path: listPath,
  parentRoute: REGELSETT_ROOT,
};
const REGELSETT_CREATE = {
  navn: 'Nytt regelsett',
  path: createPath,
  parentRoute: REGELSETT_ROOT,
};
const REGELSETT_EDIT = {
  navn: 'Endre regelsett',
  path: idPath,
  parentRoute: REGELSETT_ROOT,
};

const VERKSEMD_LIST = {
  navn: 'Verksemder',
  path: 'verksemder',
  imgSrc: verksemderImg,
  disabled: true,
};
const VERKSEMD_CREATE = {
  navn: 'Ny verksemd',
  path: createPath,
  parentRoute: VERKSEMD_LIST,
};
const VERKSEMD_EDIT = {
  navn: 'Endre verksemder',
  path: idPath,
  parentRoute: VERKSEMD_LIST,
};

const LOEYSING_ROOT = {
  navn: 'Løysingar',
  path: 'loeysingar',
  imgSrc: loeysingImg,
};

const LOEYSING_LIST = {
  navn: 'Løysingar',
  path: listPath,
  parentRoute: LOEYSING_ROOT,
};
const LOEYSING_CREATE = {
  navn: 'Ny løysing',
  path: createPath,
  parentRoute: LOEYSING_ROOT,
};
const LOEYSING_EDIT = {
  navn: 'Endre løysingar',
  path: idPath,
  parentRoute: LOEYSING_ROOT,
};

const KRAV_LIST = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
  disabled: true,
};
const KRAV_CREATE = {
  navn: 'Krav',
  path: createPath,
  parentRoute: KRAV_LIST,
};
const KRAV_EDIT = {
  navn: 'Krav',
  path: idPath,
  parentRoute: KRAV_LIST,
};

const TEST = {
  navn: 'Test',
  path: 'test',
};

const TEST_SIDEUTVAL_LIST = {
  navn: 'Sideutval',
  path: 'sideutval',
  parentRoute: MAALING,
};

const TEST_CRAWLING_RESULT_LIST = {
  navn: 'Kvalitetssikring',
  path: ':loeysingId',
  parentRoute: TEST_SIDEUTVAL_LIST,
};

const TEST_TESTING_LIST = {
  navn: 'Tester',
  path: 'testing',
  parentRoute: MAALING,
};

const TEST_RESULT_LIST = {
  navn: 'Resultat',
  path: ':loeysingId',
  parentRoute: TEST_TESTING_LIST,
};

const DISKUSJON_ROOT = {
  navn: 'Diskusjon',
  path: '/',
  parentRoute: ROOT,
  imgSrc: diskusjonImg,
  disabled: true,
};
const MINE_SAKER_ROOT = {
  navn: 'Mine saker',
  path: '/',
  parentRoute: ROOT,
  imgSrc: mineSakerImg,
  disabled: true,
};
const MINE_TESTAR_ROOT = {
  navn: 'Mine testar',
  path: '/',
  parentRoute: ROOT,
  imgSrc: mineTestarImg,
  disabled: true,
};
const NY_TEST_ROOT = {
  navn: 'Ny test',
  path: '/',
  parentRoute: ROOT,
  imgSrc: nyTestImg,
  disabled: true,
};
const RESULTAT_ROOT = {
  navn: 'Resultat',
  path: '/',
  parentRoute: ROOT,
  imgSrc: resultatImg,
  disabled: true,
};
const TEKNIKK_ROOT = {
  navn: 'Teknikk',
  path: '/',
  parentRoute: ROOT,
  imgSrc: teknikkImg,
  disabled: true,
};

const KONKURRANSE_ROOT = {
  navn: 'Konkurranse',
  path: '/',
  parentRoute: ROOT,
  imgSrc: konkurranseImg,
  disabled: true,
};

export const appRoutes: IRoutes = {
  ROOT: ROOT,
  TESTREGEL_ROOT: TESTREGEL_ROOT,
  TESTREGEL_LIST: TESTREGEL_LIST,
  TESTREGEL_CREATE: TESTREGEL_CREATE,
  TESTREGEL_EDIT: TESTREGEL_EDIT,
  REGELSETT_ROOT: REGELSETT_ROOT,
  REGELSETT_LIST: REGELSETT_LIST,
  REGELSETT_CREATE: REGELSETT_CREATE,
  REGELSETT_EDIT: REGELSETT_EDIT,
  VERKSEMD_LIST: VERKSEMD_LIST,
  VERKSEMD_CREATE: VERKSEMD_CREATE,
  VERKSEMD_EDIT: VERKSEMD_EDIT,
  KRAV_LIST: KRAV_LIST,
  KRAV_CREATE: KRAV_CREATE,
  KRAV_EDIT: KRAV_EDIT,

  LOEYSING_ROOT: LOEYSING_ROOT,
  LOEYSING_LIST: LOEYSING_LIST,
  LOEYSING_CREATE: LOEYSING_CREATE,
  LOEYSING_EDIT: LOEYSING_EDIT,

  SAK_ROOT: SAK_ROOT,
  SAK: SAK,
  SAK_EDIT: SAK_EDIT,
  SAK_CREATE: SAK_CREATE,

  MAALING_ROOT: MAALING_ROOT,
  MAALING: MAALING,
  MAALING_EDIT: MAALING_EDIT,
  MAALING_CREATE: MAALING_CREATE,

  TEST: TEST,
  TEST_SIDEUTVAL_LIST: TEST_SIDEUTVAL_LIST,
  TEST_CRAWLING_RESULT_LIST: TEST_CRAWLING_RESULT_LIST,
  TEST_TESTING_LIST: TEST_TESTING_LIST,
  TEST_RESULT_LIST: TEST_RESULT_LIST,

  DISKUSJON_ROOT: DISKUSJON_ROOT,
  MINE_SAKER_ROOT: MINE_SAKER_ROOT,
  MINE_TESTAR_ROOT: MINE_TESTAR_ROOT,
  NY_TEST_ROOT: NY_TEST_ROOT,
  RESULTAT_ROOT: RESULTAT_ROOT,
  TEKNIKK_ROOT: TEKNIKK_ROOT,
  KONKURRANSE_ROOT: KONKURRANSE_ROOT,
};

export const utval = [
  appRoutes.LOEYSING_ROOT,
  appRoutes.VERKSEMD_LIST,
  appRoutes.TESTREGEL_ROOT,
  appRoutes.KRAV_LIST,
  appRoutes.TEKNIKK_ROOT,
];

export const saksbehandling = [
  appRoutes.MINE_SAKER_ROOT,
  appRoutes.SAK_ROOT,
  appRoutes.MAALING_ROOT,
];

export const testing = [appRoutes.MINE_TESTAR_ROOT, appRoutes.RESULTAT_ROOT];

export const anna = [appRoutes.DISKUSJON_ROOT, appRoutes.KONKURRANSE_ROOT];

export type IdReplacement = {
  id: string;
  pathParam: string;
};

export const getFullPath = (
  route: AppRoute,
  ...ids: IdReplacement[]
): string => {
  if (route === appRoutes.ROOT) {
    return '..';
  }

  let path = getPathFromRoot(route);

  if (ids) {
    for (const { id, pathParam } of ids) {
      path = path.replace(pathParam, id);
    }
  }

  return `/${path}`;
};

const getPathFromRoot = (route: AppRoute): string => {
  if (route.parentRoute) {
    return [getPathFromRoot(route.parentRoute), route.path].join('/');
  } else {
    return route.path;
  }
};

export default appRoutes;
