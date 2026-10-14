import { useCallback } from 'react';
import { mapStatus, toTestregelStatusKey } from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { ActiveTest, ManuellTestStatus } from '@test/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Severity } from '@common/types';

type RaiseAlert = (severity: Severity, title: string, message: string) => void;

const getSelectedTestResults = (
  testResults: ResultatManuellKontroll[],
  testregelId: number,
  sideId: number
) => testResults.filter((tr) => tr.testregelId === testregelId && tr.sideutvalId === sideId);

const isSideElementTestregel = (testregelSchema: string) =>
  JSON.parse(testregelSchema).element.toLowerCase() === 'side';

const shouldCreateTestResult = (status: ManuellTestStatus, selected: ResultatManuellKontroll[]) =>
  (status === 'under-arbeid' || status === 'ikkje-forekomst' || status === 'samsvar') &&
  isNotDefined(selected);

const canSetFerdigStatus = (
  selected: ResultatManuellKontroll[],
  testregel: Testregel,
  raiseAlert: RaiseAlert
) => {
  if (selected.some((tr) => isNotDefined(tr.elementResultat))) {
    raiseAlert(
      'warning',
      'Kan ikkje sette status ferdig',
      'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
    );
    return false;
  }

  if (testregel.testregelSchema != null && testregel.modus != 'manuell-forenkla') {
    if (isSideElementTestregel(testregel.testregelSchema) && selected.some((tr) => !isDefined(tr.kommentar))) {
      raiseAlert(
        'warning',
        'Kan ikkje sette status ferdig',
        'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
      );
      return false;
    }
  }

  return true;
};

interface UseTestregelSelectionProps {
  testgrunnlagId: number;
  sideId: number;
  testResults: ResultatManuellKontroll[];
  testStatusMap: Map<string, ManuellTestStatus>;
  testreglarForLoeysing: Testregel[];
  activeTest: ActiveTest | undefined;
  setActiveTest: (test: ActiveTest | undefined) => void;
  doCreateTestResult: (testregel: Testregel, sideId: number | undefined, status?: ManuellTestStatus) => void;
  doUpdateTestResultStatus: (results: ResultatManuellKontroll[]) => void;
  processData: (results: ResultatManuellKontroll[], sideId: number, testregel?: Testregel) => void;
  raiseAlert: RaiseAlert;
}

export const useTestregelSelection = ({
  testgrunnlagId,
  sideId,
  testResults,
  testStatusMap,
  testreglarForLoeysing,
  activeTest,
  setActiveTest,
  doCreateTestResult,
  doUpdateTestResultStatus,
  processData,
  raiseAlert,
}: UseTestregelSelectionProps) => {
  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      const nextTestregel = testreglarForLoeysing.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        raiseAlert('danger', 'Kan ikkje byta testregel', 'Det oppstod ein feil ved byting av testregel');
        return;
      }
      if (nextTestregel.id === activeTest?.testregel.id) {
        setActiveTest(undefined);
        return;
      }
      const statusKey = toTestregelStatusKey(testgrunnlagId, nextTestregel.id, sideId);
      if (testStatusMap.get(statusKey) === 'ikkje-starta') {
        doCreateTestResult(nextTestregel, sideId);
      } else {
        processData(testResults, sideId, nextTestregel);
      }
    },
    [testreglarForLoeysing, testStatusMap, testResults, sideId, activeTest, testgrunnlagId, processData, doCreateTestResult, raiseAlert, setActiveTest]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testregel = testreglarForLoeysing.find((tr) => tr.id === testregelId);
      const selected = getSelectedTestResults(testResults, testregelId, sideId);

      console.log(selected);

      if (!testregel) return;
      console.log('Update status', status +  "  " + isNotDefined(selected));

      if (shouldCreateTestResult(status, selected)) {
        console.log('shouldCreateTestResult', status, selected);
        doCreateTestResult(testregel, sideId, status === 'under-arbeid' ? undefined : status);
        if(status!== 'under-arbeid')
        {
          setActiveTest(undefined);
        }
        console.log('Created new test result for testregelId:', testregelId, 'with status:', status);
        return;
      }

      if (status === 'ferdig' && !canSetFerdigStatus(selected, testregel, raiseAlert)) {
        return;
      }

      const updated = selected.map((tr) => ({ ...tr, testregelId, status: mapStatus(status) }));
      doUpdateTestResultStatus(updated);
      if (testregelId === activeTest?.testregel.id) setActiveTest(undefined);
    },
    [testreglarForLoeysing, testResults, sideId, activeTest, doCreateTestResult, doUpdateTestResultStatus, raiseAlert, setActiveTest]
  );

  return { onChangeTestregel, onChangeTestregelStatus };
};
