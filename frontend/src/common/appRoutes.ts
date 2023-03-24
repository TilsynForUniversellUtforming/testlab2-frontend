import kravImg from '../assets/krav.png';
import loeysingImg from '../assets/loeysingar.svg';
import maalingImg from '../assets/maaling.svg';
import sakerImg from '../assets/saker.png';
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
};

interface IRoutes {
  ROOT: AppRoute;
  TESTREGEL_LIST: AppRoute;
  TESTREGEL_CREATE: AppRoute;
  TESTREGEL_EDIT: AppRoute;
  REGELSETT_LIST: AppRoute;
  REGELSETT_CREATE: AppRoute;
  REGELSETT_EDIT: AppRoute;
  VERKSEMD_LIST: AppRoute;
  VERKSEMD_CREATE: AppRoute;
  VERKSEMD_EDIT: AppRoute;
  LOEYSING_LIST: AppRoute;
  LOEYSING_CREATE: AppRoute;
  LOEYSING_EDIT: AppRoute;
  KRAV_LIST: AppRoute;
  KRAV_CREATE: AppRoute;
  KRAV_EDIT: AppRoute;

  SAK_LIST: AppRoute;
  SAK_ROOT: AppRoute;
  SAK: AppRoute;
  SAK_CREATE: AppRoute;
  SAK_EDIT: AppRoute;

  MAALING_LIST: AppRoute;
  MAALING_ROOT: AppRoute;
  MAALING: AppRoute;
  MAALING_CREATE: AppRoute;
  MAALING_EDIT: AppRoute;

  TEST: AppRoute;
  TEST_CONFIRM: AppRoute;
  TEST_SIDEUTVAL_LIST: AppRoute;
  TEST_CRAWLING_RESULT_LIST: AppRoute;
  TEST_TESTING_LIST: AppRoute;
  TEST_RESULT_LIST: AppRoute;
}

const ROOT = {
  navn: 'uu',
  path: '/',
};
const SAK_ROOT = {
  navn: 'Sak',
  path: 'sak',
};
const SAK_LIST = {
  navn: 'Saker',
  path: 'saker',
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
};
const SAK_EDIT = {
  navn: 'Endre sak',
  path: editPath,
  parentRoute: SAK_ROOT,
};
const MAALING_ROOT = {
  navn: 'Måling',
  path: 'maaling',
};
const MAALING_LIST = {
  navn: 'Målinger',
  path: 'maalinger',
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
const TESTREGEL_LIST = {
  navn: 'Testreglar',
  path: 'testreglar',
  imgSrc: testingImg,
};
const TESTREGEL_CREATE = {
  navn: 'Ny testregel',
  path: createPath,
  parentRoute: TESTREGEL_LIST,
};
const TESTREGEL_EDIT = {
  navn: 'Endre testregel',
  path: idPath,
  parentRoute: TESTREGEL_LIST,
};

const REGELSETT_LIST = {
  navn: 'Regelsett',
  path: 'regelsett',
  parentRoute: TESTREGEL_LIST,
};
const REGELSETT_CREATE = {
  navn: 'Nytt regelsett',
  path: createPath,
  parentRoute: REGELSETT_LIST,
};
const REGELSETT_EDIT = {
  navn: 'Endre regelsett',
  path: idPath,
  parentRoute: REGELSETT_LIST,
};

const VERKSEMD_LIST = {
  navn: 'Verksemder',
  path: 'verksemder',
  imgSrc: verksemderImg,
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

const LOEYSING_LIST = {
  navn: 'Løysingar',
  path: 'loeysingar',
  imgSrc: loeysingImg,
};
const LOEYSING_CREATE = {
  navn: 'Ny løysing',
  path: createPath,
  parentRoute: VERKSEMD_LIST,
};
const LOEYSING_EDIT = {
  navn: 'Endre løysingar',
  path: idPath,
  parentRoute: VERKSEMD_LIST,
};

const KRAV_LIST = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
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

const TEST_CONFIRM = {
  navn: 'Endre test',
  path: idPath,
  parentRoute: TEST,
};

const TEST_SIDEUTVAL_LIST = {
  navn: 'Sideutval',
  path: ':id/sideutval',
  parentRoute: TEST,
};

const TEST_CRAWLING_RESULT_LIST = {
  navn: 'Kvalitetssikring',
  path: ':id/sideutval/:loeysingId',
  parentRoute: TEST,
};

const TEST_TESTING_LIST = {
  navn: 'Tester',
  path: ':id/testing',
  parentRoute: TEST,
};

const TEST_RESULT_LIST = {
  navn: 'Resultat',
  path: ':id/resultat/:loeysingId',
  parentRoute: TEST,
};

export const appRoutes: IRoutes = {
  ROOT: ROOT,
  TESTREGEL_LIST: TESTREGEL_LIST,
  TESTREGEL_CREATE: TESTREGEL_CREATE,
  TESTREGEL_EDIT: TESTREGEL_EDIT,
  REGELSETT_LIST: REGELSETT_LIST,
  REGELSETT_CREATE: REGELSETT_CREATE,
  REGELSETT_EDIT: REGELSETT_EDIT,
  VERKSEMD_LIST: VERKSEMD_LIST,
  VERKSEMD_CREATE: VERKSEMD_CREATE,
  VERKSEMD_EDIT: VERKSEMD_EDIT,
  LOEYSING_LIST: LOEYSING_LIST,
  LOEYSING_CREATE: LOEYSING_CREATE,
  LOEYSING_EDIT: LOEYSING_EDIT,
  KRAV_LIST: KRAV_LIST,
  KRAV_CREATE: KRAV_CREATE,
  KRAV_EDIT: KRAV_EDIT,
  SAK_LIST: SAK_LIST,
  SAK_ROOT: SAK_ROOT,
  SAK: SAK,
  SAK_EDIT: SAK_EDIT,
  SAK_CREATE: SAK_CREATE,

  MAALING_LIST: MAALING_LIST,
  MAALING_ROOT: MAALING_ROOT,
  MAALING: MAALING,
  MAALING_EDIT: MAALING_EDIT,
  MAALING_CREATE: MAALING_CREATE,

  TEST: TEST,
  TEST_CONFIRM: TEST_CONFIRM,
  TEST_SIDEUTVAL_LIST: TEST_SIDEUTVAL_LIST,
  TEST_CRAWLING_RESULT_LIST: TEST_CRAWLING_RESULT_LIST,
  TEST_TESTING_LIST: TEST_TESTING_LIST,
  TEST_RESULT_LIST: TEST_RESULT_LIST,
};

export const verktoey = [
  appRoutes.SAK_LIST,
  appRoutes.MAALING_LIST,
  appRoutes.TESTREGEL_LIST,
  appRoutes.VERKSEMD_LIST,
  appRoutes.LOEYSING_LIST,
  appRoutes.KRAV_LIST,
];

export type IdReplacement = {
  id: string;
  pathParam: string;
};

export const getFullPath = (
  route: AppRoute,
  ...ids: IdReplacement[]
): string => {
  let path = route.parentRoute?.path
    ? [route.parentRoute.path, route.path].join('/')
    : route.path;

  if (ids) {
    for (const { id, pathParam } of ids) {
      path = path.replace(pathParam, id);
    }
  }

  return `/${path}`;
};

export default appRoutes;
