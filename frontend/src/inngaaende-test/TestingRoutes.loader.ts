import { fetchTestResults, listTestgrunnlag } from '@test/api/testing-api';
import { ResultatManuellKontroll } from '@test/api/types';
import { TestOverviewLoaderData } from '@test/test-overview/TestOverview';
import { TestOverviewLoaderResponse } from '@test/types';
import {
  getIdFromParams,
  getInnhaldstypeInTest,
  toTestKeys,
} from '@test/util/testregelUtils';
import {
  listInnhaldstype,
  listTestreglarWithMetadata,
} from '@testreglar/api/testreglar-api';
import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { fetchKontroll, listSideutvalType } from '../kontroll/kontroll-api';
import { Kontroll } from '../kontroll/types';
import { findStyringsdataForKontroll } from '../styringsdata/api/styringsdata-api';

export const testLoader = async ({ params }: LoaderFunctionArgs) => {
  const kontrollId = Number(params?.id);

  if (isNaN(kontrollId) || kontrollId <= 0) {
    throw new Error('Ugyldig kontroll-id');
  }

  const [
    kontrollPromise,
    sideutvalTypePromise,
    innhaldstypePromise,
    testreglarPromise,
  ] = await Promise.allSettled([
    fetchKontroll(kontrollId),
    listSideutvalType(),
    listInnhaldstype(),
    listTestreglarWithMetadata(),
  ]);

  if (sideutvalTypePromise.status === 'rejected') {
    throw new Error('Kunne ikkje hente sideutvaltyper');
  }

  if (innhaldstypePromise.status === 'rejected') {
    throw new Error('Kunne ikkje hente innhaldstypar');
  }

  if (kontrollPromise.status === 'rejected') {
    throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
  }

  if (testreglarPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testreglar`);
  }

  const kontrollResponse = kontrollPromise.value;

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();

  const kontrollTestregelIdList =
    kontroll.testreglar?.testregelList?.map((tr) => tr.id) ?? [];

  const kontrollTestreglar = testreglarPromise.value.filter((tr) =>
    kontrollTestregelIdList.includes(tr.id)
  );

  const innhaldstypeList = innhaldstypePromise.value;
  return defer({
    sideutvalTypeList: sideutvalTypePromise.value,
    innhaldstypeTestingList: getInnhaldstypeInTest(
      kontrollTestreglar,
      innhaldstypeList
    ),
  });
};

export const testOverviewLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<TestOverviewLoaderData> => {
  const kontrollId = getIdFromParams(params?.id);
  const [kontrollPromise, testgrunnlagPromise, styringsdataListPromise] =
    await Promise.allSettled([
      fetchKontroll(kontrollId),
      listTestgrunnlag(kontrollId),
      findStyringsdataForKontroll(kontrollId),
    ]);

  if (testgrunnlagPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testgrunnlag`);
  }

  if (styringsdataListPromise.status === 'rejected') {
    throw new Error('Henting av styringsdata feila');
  }

  if (kontrollPromise.status === 'rejected') {
    throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
  }

  const kontrollResponse = kontrollPromise.value;

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();
  const testgrunnlag = testgrunnlagPromise.value;

  const resultater: ResultatManuellKontroll[][] = await Promise.all(
    testgrunnlag.map((t) => fetchTestResults(t.id))
  );

  const loeysingWithSideutvalIds = kontroll.sideutvalList.map(
    (su) => su.loeysingId
  );
  const loeysingWithSideutval =
    kontroll.utval?.loeysingar.filter((l) =>
      loeysingWithSideutvalIds.includes(l.id)
    ) ?? [];

  return {
    loeysingList: loeysingWithSideutval,
    resultater: resultater.flat(),
    testgrunnlag: testgrunnlag,
    styringsdata: styringsdataListPromise.value.styringsdataLoeysing,
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

  if (testgrunnlagPromise.status === 'rejected') {
    throw new Error(
      `Kunne ikkje hente testgrunnlag for kontrollid ${kontrollId}`
    );
  }

  const testgrunnlag = testgrunnlagPromise.value.find(
    (tg) => tg.id === testgrunnlagId
  );

  if (!testgrunnlag) {
    throw new Error('Testgrunnlag finns ikkje for kontroll');
  }

  if (testResults.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testresutlat for id ${testgrunnlagId}`);
  }

  if (testreglarPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente testreglar`);
  }

  if (kontrollPromise.status === 'rejected') {
    throw new Error(`Fann ikkje kontroll med id ${kontrollId}`);
  }

  const kontrollResponse = kontrollPromise.value;

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();

  const testResultsForLoeysing = testResults.value.filter(
    (tr) => tr.loeysingId === loeysingId && tr.testgrunnlagId === testgrunnlagId
  );

  const testgrunnlagSideutvalIds = testgrunnlag.sideutval.map((su) => su.id);
  const sideutvalForLoeysing = kontroll.sideutvalList.filter((su) =>
    testgrunnlagSideutvalIds.includes(su.id)
  );

  const testgrunnlagTestregelIds = testgrunnlag.testreglar.map((tr) => tr.id);
  const testreglarForLoeysing = testreglarPromise.value.filter((tr) =>
    testgrunnlagTestregelIds.includes(tr.id)
  );

  const activeLoeysing = kontroll.utval?.loeysingar?.find(
    (l) => l.id === loeysingId
  );

  if (!activeLoeysing) {
    throw new Error(`Ugyldig løysing for id ${loeysingId}`);
  }

  return {
    testResultatForLoeysing: testResultsForLoeysing,
    sideutvalForLoeysing: sideutvalForLoeysing,
    testreglarForLoeysing: testreglarForLoeysing,
    testKeys: toTestKeys(testgrunnlag, testResultsForLoeysing),
    activeLoeysing: activeLoeysing,
    kontrollTitle: kontroll.tittel,
  };
};
