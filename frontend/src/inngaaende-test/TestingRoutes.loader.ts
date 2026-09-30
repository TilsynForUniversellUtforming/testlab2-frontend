import {
  fetchTestResults,
  getTestoverview,
  getTestoverviewForBrukar,
  listTestgrunnlag,
} from '@test/api/testing-api';
import { ResultatManuellKontroll } from '@test/api/types';
import {
  Testgrunnlag,
  TestOverviewLoaderResponse,
  TestOverviewLoaderData,
  TestOverviewElement,
  TestgrunnlagOverviewElement,
} from '@test/types';
import {
  getIdFromParams,
  getInnhaldstypeInTest,
  toTestKeys,
} from '@test/util/testregelUtils';
import { listTestreglarWithMetadata } from '@testreglar/api/testreglar-api';
import { LoaderFunctionArgs } from 'react-router';

import {
  fetchKontroll,
  fetchKontrollTestmetadata,
} from '../kontroll/kontroll-api';
import { Kontroll, KontrollTestingMetadata } from '../kontroll/types';
import { findStyringsdataForKontroll } from '../styringsdata/api/styringsdata-api';
import { Testregel } from '@testreglar/api/types';
import { Loeysing } from '@loeysingar/api/types';
import {
  filterStyringdataForLoeysing,
  findLoeysingNamn,
  getStyringsdataStatus,
  getSideutvalForLoeysing,
  groupSideutvalByLoeysing,
  teststatus,
  viewTestType,
  filterResultaterForLoeysingTestgrunnlag,
} from '@test/test-overview/util/testOverviewUtils';

// --- Generic settlement validator ---

function assertFulfilled<T>(
  result: PromiseSettledResult<T>,
  errorMessage: string
): T {
  if (result.status === 'rejected') {
    throw new Error(errorMessage);
  }
  return result.value;
}

// --- Kontroll helpers ---

function validateKontrollParam(kontrollId: number) {
  if (Number.isNaN(kontrollId) || kontrollId <= 0) {
    throw new Error('Ugyldig kontroll-id');
  }
}

async function validatedKontroll(
  kontrollPromise: PromiseSettledResult<Response>,
  kontrollId: number
): Promise<Kontroll> {
  const kontrollResponse = assertFulfilled(
    kontrollPromise,
    `Fann ikkje kontroll med id ${kontrollId}`
  );
  if (!kontrollResponse.ok) {
    throw new Error(
      kontrollResponse.status === 404
        ? `Det finnes ikke en kontroll med id ${kontrollId}`
        : 'Klarte ikke å hente kontrollen.'
    );
  }
  return kontrollResponse.json();
}

function validatedTestoverview(
  testoverviewPromise: PromiseSettledResult<TestgrunnlagOverviewElement[]>,
): TestgrunnlagOverviewElement[] {
  return assertFulfilled(testoverviewPromise, 'Kunne ikkje hente testgrunnlag');
}

function getLoeysingarForTestgrunnlag(
  kontroll: Kontroll,
  testgrunnlag: Testgrunnlag[]
): Loeysing[] {
  const loeysingIdsWithSideutval = new Set(
    testgrunnlag.flatMap((tg) => tg.sideutval.map((su) => su.loeysingId))
  );
  return (kontroll.utval?.loeysingar ?? []).filter((l) =>
    loeysingIdsWithSideutval.has(l.id)
  );
}

function getActiveLoeysing(kontroll: Kontroll, loeysingId: number) {
  const activeLoeysing = kontroll.utval?.loeysingar?.find(
    (l) => l.id === loeysingId
  );
  if (!activeLoeysing) {
    throw new Error(`Ugyldig løysing for id ${loeysingId}`);
  }
  return activeLoeysing;
}

// --- Testgrunnlag helpers ---

function validatedTestgrunnlag(
  testgrunnlagPromise: PromiseSettledResult<Testgrunnlag[]>
): Testgrunnlag[] {
  return assertFulfilled(testgrunnlagPromise, 'Kunne ikkje hente testgrunnlag');
}

function getTestgrunnlagById(
  testgrunnlagPromise: PromiseSettledResult<Testgrunnlag[]>,
  testgrunnlagId: number
): Testgrunnlag {
  const list = validatedTestgrunnlag(testgrunnlagPromise);
  const testgrunnlag = list.find((tg) => tg.id === testgrunnlagId);
  if (!testgrunnlag) {
    throw new Error('Testgrunnlag finns ikkje for kontroll');
  }
  return testgrunnlag;
}

async function fetchAllTestresultat(
  testgrunnlag: Testgrunnlag[]
): Promise<ResultatManuellKontroll[]> {
  const resultater = await Promise.all(
    testgrunnlag.map((t) => fetchTestResults(t.id))
  );
  return resultater.flat();
}

// --- Testregel helpers ---

function validatedTestreglar(
  testreglarPromise: PromiseSettledResult<Testregel[]>
): Testregel[] {
  return assertFulfilled(testreglarPromise, 'Kunne ikkje hente testreglar');
}

function getTestreglarForTestgrunnlag(
  testreglar: Testregel[],
  testgrunnlag: Testgrunnlag
): Testregel[] {
  const ids = new Set(testgrunnlag.testreglar.map((tr) => tr));
  return testreglar.filter((tr) => ids.has(tr.id));
}

// --- Testresultat helpers ---

function getTestresultatForLoeysing(
  testresultatPromise: PromiseSettledResult<ResultatManuellKontroll[]>,
  testgrunnlagId: number,
  loeysingId: number
): ResultatManuellKontroll[] {
  const all = assertFulfilled(
    testresultatPromise,
    `Kunne ikkje hente testresultat for id ${testgrunnlagId}`
  );
  return all.filter(
    (tr) => tr.loeysingId === loeysingId && tr.testgrunnlagId === testgrunnlagId
  );
}


// --- Loaders ---

export const testLoader = async ({ params }: LoaderFunctionArgs) => {
  const kontrollId = Number(params?.id);
  validateKontrollParam(kontrollId);

  const [kontrollMetadataResult] = await Promise.allSettled([
    fetchKontrollTestmetadata(kontrollId),
  ]);

  const metadata = assertFulfilled(
    kontrollMetadataResult,
    'Feil ved henting av kontroll metadata'
  ) as KontrollTestingMetadata;

  return {
    sideutvalTypeList: metadata.sideutvalList,
    innhaldstypeTestingList: getInnhaldstypeInTest(metadata.innhaldstypeTesting),
  };
};

export const testOverviewLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderData> => {
  const kontrollId = getIdFromParams(params?.id);

  const [ styringsdataResult, testoverviewResult] =
    await Promise.allSettled([
      findStyringsdataForKontroll(kontrollId),
      getTestoverview(kontrollId),
    ]);

  const testoverviewList = validatedTestoverview(testoverviewResult);

  const styringsdataRejected = styringsdataResult.status === 'rejected';


  return {
    styringsdataError: styringsdataRejected,
    testgrunnlagOverviewElements: testoverviewList,
  };
};

export const testOverViewByUserLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderData> => {

  const [testoverviewResult] = await Promise.allSettled([
    getTestoverviewForBrukar(),
  ]);

  const testoverviewList = validatedTestoverview(testoverviewResult);



  return {
    styringsdataError: false,
    testgrunnlagOverviewElements: testoverviewList,
  };
};

export const testOverviewLoeysingLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderResponse> => {
  const kontrollId = getIdFromParams(params?.id);
  const testgrunnlagId = getIdFromParams(params?.testgrunnlagId);
  const loeysingId = getIdFromParams(params?.loeysingId);

  const [kontrollResult, testgrunnlagResult, testresultatResult, testreglarResult] =
    await Promise.allSettled([
      fetchKontroll(kontrollId),
      listTestgrunnlag(kontrollId),
      fetchTestResults(testgrunnlagId),
      listTestreglarWithMetadata(),
    ]);

  const testgrunnlag = getTestgrunnlagById(testgrunnlagResult, testgrunnlagId);
  const kontroll = await validatedKontroll(kontrollResult, kontrollId);
  const testreglar = validatedTestreglar(testreglarResult);
  const testResultatForLoeysing = getTestresultatForLoeysing(
    testresultatResult,
    testgrunnlagId,
    loeysingId
  );
  getTestreglarForTestgrunnlag(testreglar, testgrunnlag);

  return {
    testResultatForLoeysing,
    sideutvalForLoeysing: getSideutvalForLoeysing(testgrunnlag, loeysingId),
    testreglarForLoeysing: getTestreglarForTestgrunnlag(testreglar, testgrunnlag),
    testKeys: toTestKeys(testgrunnlag, testResultatForLoeysing),
    activeLoeysing: getActiveLoeysing(kontroll, loeysingId),
    kontrollTitle: kontroll.tittel,
  };
};
