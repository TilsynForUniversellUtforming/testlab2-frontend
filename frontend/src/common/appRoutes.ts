import diskusjonImg from '../assets/diskusjon.svg';
import kravImg from '../assets/krav.png';
import loeysingImg from '../assets/loeysingar.svg';
import maalingImg from '../assets/maaling.svg';
import mineTestarImg from '../assets/mine_testar.png';
import qualWebImg from '../assets/qualweb.png';
import resultatImg from '../assets/resultat.svg';
import sakerImg from '../assets/saker.png';
import teknikkarImg from '../assets/teknikkar.png';
import testerImg from '../assets/tester.png';
import testingImg from '../assets/testreglar.svg';
import verksemderImg from '../assets/verksemder.svg';

/* Typer routes */
export type AppRoute = {
  navn: string;
  path: string;
  imgSrc?: string;
  parentRoute?: AppRoute;
};

interface IRoutes {
  ROOT: AppRoute;
  SAKER: AppRoute;
  MAALING: AppRoute;
  TESTREGEL: AppRoute;
  CREATE_TESTREGEL: AppRoute;
  EDIT_TESTREGEL: AppRoute;
  REGELSETT: AppRoute;
  CREATE_REGELSETT: AppRoute;
  EDIT_REGELSETT: AppRoute;
  VERKSEMDER: AppRoute;
  LOEYSINGAR: AppRoute;
  KRAV: AppRoute;
  TEKNIKKAR: AppRoute;
  DISKUSJON: AppRoute;
  RESULTAT: AppRoute;
  CREATE_TEST: AppRoute;
  EDIT_TEST: AppRoute;
  CRAWLING_TEST: AppRoute;
  KVALITETSSIKRING_TEST: AppRoute;
  TESTING_TEST: AppRoute;
  RESULTAT_TEST: AppRoute;
  MINE_TESTER: AppRoute;
  QUALWEB: AppRoute;
}

const ROOT = {
  navn: 'uu',
  path: '/',
};
const SAKER = {
  navn: 'Saker',
  path: 'saker',
  imgSrc: sakerImg,
};
const MAALING = {
  navn: 'Måling',
  path: 'maaling',
  imgSrc: maalingImg,
};
const TESTREGEL = {
  navn: 'Testreglar',
  path: 'testreglar',
  imgSrc: testingImg,
};
const CREATE_TESTREGEL = {
  navn: 'Ny testregel',
  path: 'ny',
  parentRoute: TESTREGEL,
};
const EDIT_TESTREGEL = {
  navn: 'Endre testregel',
  path: ':id',
  parentRoute: TESTREGEL,
};
const REGELSETT = {
  navn: 'Regelsett',
  path: 'regelsett',
  parentRoute: TESTREGEL,
};
const CREATE_REGELSETT = {
  navn: 'Nytt regelsett',
  path: 'ny',
  parentRoute: REGELSETT,
};
const EDIT_REGELSETT = {
  navn: 'Endre regelsett',
  path: ':id',
  parentRoute: REGELSETT,
};
const VERKSEMDER = {
  navn: 'Verksemder',
  path: 'verksemder',
  imgSrc: verksemderImg,
};
const LOEYSINGAR = {
  navn: 'Løysingar',
  path: 'loeysingar',
  imgSrc: loeysingImg,
};
const KRAV = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
};
const TEKNIKKAR = {
  navn: 'Teknikkar',
  path: 'teknikkar',
  imgSrc: teknikkarImg,
};
const DISKUSJON = {
  navn: 'Diskusjon',
  path: 'diskusjon',
  imgSrc: diskusjonImg,
};
const RESULTAT = {
  navn: 'Resultat',
  path: 'resultat',
  imgSrc: resultatImg,
};
const CREATE_TEST = {
  navn: 'Ny test',
  path: 'test',
  imgSrc: testerImg,
};

const EDIT_TEST = {
  navn: '',
  path: ':id',
  parentRoute: CREATE_TEST,
};

const CRAWLING_TEST = {
  navn: 'Crawling',
  path: ':id/crawling',
  parentRoute: CREATE_TEST,
};

const KVALITETSSIKRING_TEST = {
  navn: 'Kvalitetssikring',
  path: ':id/kvalitetssikring',
  parentRoute: CREATE_TEST,
};

const TESTING_TEST = {
  navn: 'Tester',
  path: ':id/testing',
  parentRoute: CREATE_TEST,
};

const RESULTAT_TEST = {
  navn: 'Resultat',
  path: ':id/resultat',
  parentRoute: CREATE_TEST,
};

const MINE_TESTER = {
  navn: 'Mine Tester',
  path: 'mine-tester',
  imgSrc: mineTestarImg,
};
const QUALWEB = {
  navn: 'QualWeb',
  path: 'qualweb',
  imgSrc: qualWebImg,
};

export const appRoutes: IRoutes = {
  ROOT: ROOT,
  SAKER: SAKER,
  MAALING: MAALING,
  TESTREGEL: TESTREGEL,
  CREATE_TESTREGEL: CREATE_TESTREGEL,
  EDIT_TESTREGEL: EDIT_TESTREGEL,
  REGELSETT: REGELSETT,
  CREATE_REGELSETT: CREATE_REGELSETT,
  EDIT_REGELSETT: EDIT_REGELSETT,
  VERKSEMDER: VERKSEMDER,
  LOEYSINGAR: LOEYSINGAR,
  KRAV: KRAV,
  TEKNIKKAR: TEKNIKKAR,
  DISKUSJON: DISKUSJON,
  RESULTAT: RESULTAT,
  CREATE_TEST: CREATE_TEST,
  EDIT_TEST: EDIT_TEST,
  CRAWLING_TEST: CRAWLING_TEST,
  KVALITETSSIKRING_TEST: KVALITETSSIKRING_TEST,
  TESTING_TEST: TESTING_TEST,
  RESULTAT_TEST: RESULTAT_TEST,
  MINE_TESTER: MINE_TESTER,
  QUALWEB: QUALWEB,
};

export const verktoey = [
  appRoutes.SAKER,
  appRoutes.MAALING,
  appRoutes.TESTREGEL,
  appRoutes.VERKSEMDER,
  appRoutes.LOEYSINGAR,
  appRoutes.KRAV,
  appRoutes.TEKNIKKAR,
  appRoutes.DISKUSJON,
];

export const testing = [
  appRoutes.RESULTAT,
  appRoutes.MINE_TESTER,
  appRoutes.QUALWEB,
  appRoutes.CREATE_TEST,
];

export type StepRoute = {
  step: number;
  route: AppRoute;
};

export const testing_steps: StepRoute[] = [
  {
    step: 1,
    route: appRoutes.CREATE_TEST,
  },
  {
    step: 1,
    route: appRoutes.EDIT_TEST,
  },
  {
    step: 2,
    route: appRoutes.CRAWLING_TEST,
  },
  {
    step: 3,
    route: appRoutes.KVALITETSSIKRING_TEST,
  },
  {
    step: 4,
    route: appRoutes.TESTING_TEST,
  },
  {
    step: 5,
    route: appRoutes.RESULTAT_TEST,
  },
];

export const getFullPath = (route: AppRoute, id?: string) => {
  const path = route.parentRoute?.path
    ? [route.parentRoute.path, route.path].join('/')
    : route.path;
  if (id) {
    return path.replace(':id', id);
  }
  return path;
};

export default appRoutes;
