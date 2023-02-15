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
export interface Route {
  navn: string;
  path: string;
}

export interface NestedRoute extends Route {
  parentRoute: Route;
}

export interface RouteIcon extends Route {
  imgSrc?: string;
}

/* Implementering av route objekter */

interface IRoutes {
  ROOT: Route;
  SAKER: RouteIcon;
  MAALING: RouteIcon;
  TESTREGEL: RouteIcon;
  CREATE_TESTREGEL: NestedRoute;
  EDIT_TESTREGEL: NestedRoute;
  REGELSETT: NestedRoute;
  CREATE_REGELSETT: NestedRoute;
  EDIT_REGELSETT: NestedRoute;
  VERKSEMDER: RouteIcon;
  LOEYSINGAR: RouteIcon;
  KRAV: RouteIcon;
  TEKNIKKAR: RouteIcon;
  DISKUSJON: RouteIcon;
  RESULTAT: RouteIcon;
  TESTER: RouteIcon;
  MINE_TESTER: RouteIcon;
  QUALWEB: RouteIcon;
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
const TESTER = {
  navn: 'Start ny test',
  path: 'tester',
  imgSrc: testerImg,
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

export const routes: IRoutes = {
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
  TESTER: TESTER,
  MINE_TESTER: MINE_TESTER,
  QUALWEB: QUALWEB,
};

/* Predefinerte lister av routes */

export const verktoey = [
  routes.SAKER,
  routes.MAALING,
  routes.TESTREGEL,
  routes.VERKSEMDER,
  routes.LOEYSINGAR,
  routes.KRAV,
  routes.TEKNIKKAR,
  routes.DISKUSJON,
];

export const testing = [
  routes.RESULTAT,
  routes.MINE_TESTER,
  routes.QUALWEB,
  routes.TESTER,
];

export default routes;
