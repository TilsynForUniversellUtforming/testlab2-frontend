export interface PathType {
  navn: string;
  path: string;
}

interface IPaths {
  ROOT: PathType;
  SAKER: PathType;
  MAALING: PathType;
  TESTREGLAR: PathType;
  VERKSEMDER: PathType;
  LOEYSINGAR: PathType;
  KRAV: PathType;
  TEKNIKKAR: PathType;
  DISKUSJON: PathType;
  RESULTAT: PathType;
  TESTER: PathType;
  MINE_TESTER: PathType;
  QUALWEB: PathType;
}

export const paths: IPaths = {
  ROOT: {
    navn: 'UU',
    path: '/',
  },
  SAKER: {
    navn: 'Saker',
    path: 'saker',
  },
  MAALING: {
    navn: 'Måling',
    path: 'maaling',
  },
  TESTREGLAR: {
    navn: 'Testreglar',
    path: 'testreglar',
  },
  VERKSEMDER: {
    navn: 'Verksemder',
    path: 'verksemder',
  },
  LOEYSINGAR: {
    navn: 'Løysingar',
    path: 'LOEYSINGAR',
  },
  KRAV: {
    navn: 'Krav',
    path: 'krav',
  },
  TEKNIKKAR: {
    navn: 'Teknikkar',
    path: 'teknikkar',
  },
  DISKUSJON: {
    navn: 'Diskusjon',
    path: 'diskusjon',
  },
  RESULTAT: {
    navn: 'Resultat',
    path: 'resultat',
  },
  TESTER: {
    navn: 'Start ny test',
    path: 'tester',
  },
  MINE_TESTER: {
    navn: 'Mine Tester',
    path: 'mine_tester',
  },
  QUALWEB: {
    navn: 'QualWeb',
    path: 'qualweb',
  },
};

export default paths;
