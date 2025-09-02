import { fetchTestResults, listTestgrunnlag } from '@test/api/testing-api';
import { ResultatManuellKontroll } from '@test/api/types';
import {
  Testgrunnlag,
  TestOverviewLoaderResponse,
  TestOverviewLoaderData,
} from '@test/types';
import {
  getIdFromParams,
  getInnhaldstypeInTest,
  toTestKeys,
} from '@test/util/testregelUtils';
import { listTestreglarWithMetadata } from '@testreglar/api/testreglar-api';
import { LoaderFunctionArgs } from 'react-router-dom';

import {
  fetchKontroll,
  fetchKontrollTestmetadata,
} from '../kontroll/kontroll-api';
import { Kontroll, KontrollTestingMetadata } from '../kontroll/types';
import { findStyringsdataForKontroll } from '../styringsdata/api/styringsdata-api';
import { SideutvalType } from 'kontroll/sideutval/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

function validateKontrollResponse(
  kontrollPromise:
    | PromiseFulfilledResult<
        Response | SideutvalType[] | InnhaldstypeTesting[] | Testregel[]
      >
    | PromiseRejectedResult,
  kontrollId: number
): Response {
  if (kontrollPromise.status === 'rejected') {
    throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
  }
  return <Response>kontrollPromise.value;
}

function handleErrorStatus(kontrollResponse: Response, kontrollId: number) {
  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
}

async function validatedKontroll(
  kontrollPromise:
    | PromiseFulfilledResult<
        Response | SideutvalType[] | InnhaldstypeTesting[] | Testregel[]
      >
    | PromiseRejectedResult,
  kontrollId: number
) {
  validateKontrollResponse(kontrollPromise, kontrollId);

  const kontrollResponse = validateKontrollResponse(
    kontrollPromise,
    kontrollId
  );
  handleErrorStatus(kontrollResponse, kontrollId);
  return await kontrollResponse.json();
}
function validatedTestreglar(
  testreglarPromise:
    | PromiseFulfilledResult<Response | Testregel[]>
    | PromiseRejectedResult
): Testregel[] {
  if (testreglarPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testreglar`);
  }
  return testreglarPromise.value as Testregel[];
}
function validateKontrollParam(kontrollId: number) {
  if (isNaN(kontrollId) || kontrollId <= 0) {
    throw new Error('Ugyldig kontroll-id');
  }
}
function validatedTestgrunnlag(
  testgrunnlagPromise:
    | PromiseFulfilledResult<Response | Testgrunnlag[]>
    | PromiseRejectedResult
): Testgrunnlag[] {
  if (testgrunnlagPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testgrunnlag`);
  }

  return testgrunnlagPromise.value as Testgrunnlag[];
}

async function getTestresultatTestgrunnlag(testgrunnlag: Testgrunnlag[]) {
  const resultater: ResultatManuellKontroll[][] = await Promise.all(
    testgrunnlag.map((t) => fetchTestResults(t.id))
  );
  return resultater;
}

function getLoeysingIdFromSideutval(testgrunnlag: Testgrunnlag[]): number[] {
  return testgrunnlag
    .map((tg) => tg.sideutval.map((su) => su.loeysingId))
    .flat();
}

function getLoysingarFromKontroll(kontroll: Kontroll) {
  return kontroll.utval?.loeysingar ?? [];
}

function getLoeysingarFromUtval(
  kontroll: Kontroll,
  loeysingWithSideutvalIds: number[]
) {
  return (
    getLoysingarFromKontroll(kontroll).filter((l) =>
      loeysingWithSideutvalIds.includes(l.id)
    ) ?? []
  );
}

function getLoeysingar(kontroll: Kontroll, testgrunnlag: Testgrunnlag[]) {
  const loeysingWithSideutvalIds = getLoeysingIdFromSideutval(testgrunnlag);
  return getLoeysingarFromUtval(kontroll, loeysingWithSideutvalIds);
}

function getTestgrunnlag(
  testgrunnlagPromise:
    | PromiseFulfilledResult<Response | Testgrunnlag[]>
    | PromiseRejectedResult,
  testgrunnlagId: number
) {
  const testgrunnlagList = validatedTestgrunnlag(testgrunnlagPromise);

  const testgrunnlag = testgrunnlagList.find((tg) => tg.id === testgrunnlagId);

  if (!testgrunnlag) {
    throw new Error('Testgrunnlag finns ikkje for kontroll');
  }
  return testgrunnlag;
}

function validatedTestresultsTestgrunnlag(
  testResults:
    | PromiseFulfilledResult<ResultatManuellKontroll[]>
    | PromiseRejectedResult,
  testgrunnlagId: number
): ResultatManuellKontroll[] {
  if (testResults.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testresutlat for id ${testgrunnlagId}`);
  }

  return testResults.value;
}

function getTestresultsForLoeysing(
  testResults:
    | PromiseFulfilledResult<ResultatManuellKontroll[]>
    | PromiseRejectedResult,
  testgrunnlagId: number,
  loeysingId: number
) {
  const testresultsTestgrunnlag = validatedTestresultsTestgrunnlag(
    testResults,
    testgrunnlagId
  );

  return testresultsTestgrunnlag.filter(
    (tr) => tr.loeysingId === loeysingId && tr.testgrunnlagId === testgrunnlagId
  );
}
function getTestreglarIdTestgrunnlag(testgrunnlag: Testgrunnlag) {
  return testgrunnlag.testreglar.map((tr) => tr.id);
}
function getSideutvalForLoeysing(
  testgrunnlag: Testgrunnlag,
  loysingId: number
) {
  return testgrunnlag.sideutval.filter((su) => su.loeysingId === loysingId);
}

function getTestreglarMetadataForLoeysing(
  testreglar: Testregel[],
  testgrunnlagTestregelIds: number[]
) {
  return testreglar.filter((tr) => testgrunnlagTestregelIds.includes(tr.id));
}

function getActiveLoeysing(kontroll: Kontroll, loeysingId: number) {
  const activeLoeysing = kontroll.utval?.loeysingar?.find(
    (l: { id: number }) => l.id === loeysingId
  );

  if (!activeLoeysing) {
    throw new Error(`Ugyldig løysing for id ${loeysingId}`);
  }
  return activeLoeysing;
}

function kontrollmetataValidated(
  kontrollMetadata:
    | PromiseFulfilledResult<Response | Awaited<KontrollTestingMetadata>>
    | PromiseRejectedResult
): KontrollTestingMetadata {
  if (kontrollMetadata.status === 'rejected') {
    throw new Error('Feil ved henting av kontroll metadata');
  } else {
    return kontrollMetadata.value as KontrollTestingMetadata;
  }
}

export const testLoader = async ({ params }: LoaderFunctionArgs) => {
  const kontrollId = Number(params?.id);
  validateKontrollParam(kontrollId);

  const [kontrollMetadata] = await Promise.allSettled([
    fetchKontrollTestmetadata(kontrollId),
  ]);

  const kontrollmetadataValidated = kontrollmetataValidated(kontrollMetadata);

  const innholdstypeTestingsList = getInnhaldstypeInTest(
    kontrollmetadataValidated.innhaldstypeTesting
  );

  return {
    sideutvalTypeList: kontrollmetadataValidated.sideutvalList,
    innhaldstypeTestingList: innholdstypeTestingsList,
  };
};

export const testOverviewLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderData> => {
  const kontrollId = getIdFromParams(params?.id);
  const [kontrollPromise, testgrunnlagPromise, styringsdataPromise] =
    await Promise.allSettled([
      fetchKontroll(kontrollId),
      listTestgrunnlag(kontrollId),
      findStyringsdataForKontroll(kontrollId),
    ]);
  const testgrunnlag = validatedTestgrunnlag(testgrunnlagPromise);

  const kontroll = await validatedKontroll(kontrollPromise, kontrollId);
  const resultater = await getTestresultatTestgrunnlag(testgrunnlag);
  const loeysingWithSideutval = getLoeysingar(kontroll, testgrunnlag);

  const styringsdataRejected = styringsdataPromise.status === 'rejected';
  const styringsdataLoeysing = styringsdataRejected
    ? []
    : styringsdataPromise.value.styringsdataLoeysing;

  return {
    loeysingList: loeysingWithSideutval,
    resultater: resultater.flat(),
    testgrunnlag: testgrunnlag,
    styringsdata: styringsdataLoeysing,
    styringsdataError: styringsdataRejected,
    kontrolltype: kontroll.kontrolltype,
  };
};

export const testOverviewLoeysingLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderResponse> => {
  const kontrollId = getIdFromParams(params?.id);
  const testgrunnlagId = getIdFromParams(params?.testgrunnlagId);
  const loeysingId = getIdFromParams(params?.loeysingId);

  const [kontrollPromise, testgrunnlagPromise, testResults, testreglarPromise] =
    await Promise.allSettled([
      fetchKontroll(kontrollId),
      listTestgrunnlag(kontrollId),
      fetchTestResults(testgrunnlagId),
      listTestreglarWithMetadata(),
    ]);

  const testgrunnlag = getTestgrunnlag(testgrunnlagPromise, testgrunnlagId);
  const testResultsForLoeysing = getTestresultsForLoeysing(
    testResults,
    testgrunnlagId,
    loeysingId
  );

  const testreglar = validatedTestreglar(testreglarPromise);

  const kontroll = await validatedKontroll(kontrollPromise, kontrollId);
  const sideutvalForLoeysing = getSideutvalForLoeysing(
    testgrunnlag,
    loeysingId
  );
  const testgrunnlagTestregelIds = getTestreglarIdTestgrunnlag(testgrunnlag);
  const testreglarForLoeysing = getTestreglarMetadataForLoeysing(
    testreglar,
    testgrunnlagTestregelIds
  );

  const activeLoeysing = getActiveLoeysing(kontroll, loeysingId);

  return {
    testResultatForLoeysing: testResultsForLoeysing,
    sideutvalForLoeysing: sideutvalForLoeysing,
    testreglarForLoeysing: testreglarForLoeysing,
    testKeys: toTestKeys(testgrunnlag, testResultsForLoeysing),
    activeLoeysing: activeLoeysing,
    kontrollTitle: kontroll.tittel,
  };
};
