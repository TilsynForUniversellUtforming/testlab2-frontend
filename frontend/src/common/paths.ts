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

export interface Path {
  navn: string;
  path: string;
  imgSrc?: string;
}

interface IPaths {
  ROOT: Path;
  SAKER: Path;
  MAALING: Path;
  TESTREGLAR: Path;
  VERKSEMDER: Path;
  LOEYSINGAR: Path;
  KRAV: Path;
  TEKNIKKAR: Path;
  DISKUSJON: Path;
  RESULTAT: Path;
  TESTER: Path;
  MINE_TESTER: Path;
  QUALWEB: Path;
}

export const paths: IPaths = {
  ROOT: {
    navn: 'uu',
    path: '/',
  },
  SAKER: {
    navn: 'Saker',
    path: 'saker',
    imgSrc: sakerImg,
  },
  MAALING: {
    navn: 'Måling',
    path: 'maaling',
    imgSrc: maalingImg,
  },
  TESTREGLAR: {
    navn: 'Testreglar',
    path: 'testreglar',
    imgSrc: testingImg,
  },
  VERKSEMDER: {
    navn: 'Verksemder',
    path: 'verksemder',
    imgSrc: verksemderImg,
  },
  LOEYSINGAR: {
    navn: 'Løysingar',
    path: 'LOEYSINGAR',
    imgSrc: loeysingImg,
  },
  KRAV: {
    navn: 'Krav',
    path: 'krav',
    imgSrc: kravImg,
  },
  TEKNIKKAR: {
    navn: 'Teknikkar',
    path: 'teknikkar',
    imgSrc: teknikkarImg,
  },
  DISKUSJON: {
    navn: 'Diskusjon',
    path: 'diskusjon',
    imgSrc: diskusjonImg,
  },
  RESULTAT: {
    navn: 'Resultat',
    path: 'resultat',
    imgSrc: resultatImg,
  },
  TESTER: {
    navn: 'Start ny test',
    path: 'tester',
    imgSrc: testerImg,
  },
  MINE_TESTER: {
    navn: 'Mine Tester',
    path: 'mine_tester',
    imgSrc: mineTestarImg,
  },
  QUALWEB: {
    navn: 'QualWeb',
    path: 'qualweb',
    imgSrc: qualWebImg,
  },
};

export const verktoey = [
  paths.SAKER,
  paths.MAALING,
  paths.TESTREGLAR,
  paths.VERKSEMDER,
  paths.LOEYSINGAR,
  paths.KRAV,
  paths.TEKNIKKAR,
  paths.DISKUSJON,
];

export const testing = [
  paths.RESULTAT,
  paths.MINE_TESTER,
  paths.QUALWEB,
  paths.TESTER,
];

export default paths;
