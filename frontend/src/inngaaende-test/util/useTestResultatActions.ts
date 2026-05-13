import { useCallback } from 'react';
import { mapStatus } from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { ActiveTest, TestResultUpdate } from '@test/types';
import { CreateTestResultat, ResultatManuellKontroll, toElementResultat } from '@test/api/types';
import {
  createTestResultat,
  deleteTestResultat,
  fetchTestResults,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { Severity } from '@common/types';

type RaiseAlert = (severity: Severity, title: string, message: string) => void;
type ProcessData = (results: ResultatManuellKontroll[], sideId: number, testregel?: Testregel) => void;

interface UseTestResultatActionsProps {
  testgrunnlagId: number;
  loeysingId: number;
  sideId: number;
  testResults: ResultatManuellKontroll[];
  activeTest: ActiveTest | undefined;
  processData: ProcessData;
  raiseAlert: RaiseAlert;
}

export const useTestResultatActions = ({
  testgrunnlagId,
  loeysingId,
  sideId,
  testResults,
  activeTest,
  processData,
  raiseAlert,
}: UseTestResultatActionsProps) => {
  const withAggregert = useCallback(
    async (
      apiCall: () => Promise<ResultatManuellKontroll[]>,
      errorMsg: string,
      activeTestregel?: Testregel
    ) => {
      try {
        const updated = await apiCall();
        await createTestresultatAggregert(testgrunnlagId).catch((e) =>
          raiseAlert('danger', 'Kunne ikkje oppdatere aggregert resultat', `Oppdatering av aggregert resultat feila ${e}`)
        );
        processData(updated, sideId, activeTestregel);
      } catch {
        raiseAlert('danger', errorMsg, `${errorMsg} feila`);
      }
    },
    [testgrunnlagId, sideId, processData, raiseAlert]
  );

  const doUpdateTestResultStatus = useCallback(
    (testResultat: ResultatManuellKontroll[]) =>
      withAggregert(() => updateTestResultatMany(testResultat), 'Kunne ikkje endre status'),
    [withAggregert]
  );

  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } = testResultUpdate;
      const activeTestResult = testResults.find((tr) => tr.id === resultatId);

      if (activeTest && sideId && activeTestResult) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId,
          loeysingId,
          testregelId: activeTest.testregel?.id,
          sideutvalId: sideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar,
          sistLagra: activeTestResult.sistLagra,
        };
        await withAggregert(() => updateTestResultat(testResult), 'Kunne ikkje lagre', activeTest.testregel);
      } else {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Ugyldig oppdatering av testresultat');
      }
    },
    [activeTest, testResults, sideId, withAggregert, raiseAlert, testgrunnlagId, loeysingId]
  );

  const doCreateTestResult = useCallback(
    async (activeTestregel: Testregel, sideutvalId: number | undefined) => {
      if (!activeTestregel || !sideutvalId) {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Ugyldig oppretting av testresultat');
        return;
      }
      try {
        await createTestResultat({
          testgrunnlagId,
          loeysingId,
          testregelId: activeTestregel.id,
          sideutvalId,
        } as CreateTestResultat);
        const alleResultater = await fetchTestResults(testgrunnlagId);
        processData(alleResultater, sideId, activeTestregel);
      } catch {
        raiseAlert('danger', 'Kunne ikkje lagre', 'Opprett testresultat feila');
      }
    },
    [sideId, testgrunnlagId, loeysingId, processData, raiseAlert]
  );

  const slettTestelement = useCallback(
    async (activeTest: ActiveTest, resultatId: number) => {
      const resultat = testResults.find((tr) => tr.id === resultatId);
      if (!resultat) {
        raiseAlert('danger', 'Resultatet finnes ikkje', `Vi prøvde å slette resultatet med id ${resultatId}, men det eksisterer ikkje.`);
        return;
      }
      try {
        const alleResultater = await deleteTestResultat(resultat);
        processData(alleResultater, sideId, activeTest.testregel);
      } catch {
        raiseAlert('danger', 'Kunne ikkje slette test', 'Sletting av test for testregel feila');
      }
    },
    [testResults, sideId, processData, raiseAlert]
  );

  const createNewTestResult = async (
    activeTestregel: Testregel,
    testgrunnlagId: number,
    loeysingId: number,
    sideId: number
  ) => {
    const nyttTestresultat: CreateTestResultat = {
      testgrunnlagId: testgrunnlagId,
      loeysingId: loeysingId,
      testregelId: activeTestregel.id,
      sideutvalId: sideId,
    };
    await createTestResultat(nyttTestresultat);
    const alleResultater = await fetchTestResults(testgrunnlagId);
    processData(alleResultater, sideId, activeTestregel);
  };

  return { doUpdateTestResultStatus, doUpdateTestResult, doCreateTestResult, slettTestelement, createNewTestResult };
};

