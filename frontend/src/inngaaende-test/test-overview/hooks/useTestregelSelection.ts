import { useCallback } from 'react';
import { mapStatus, toTestregelStatusKey } from '@test/util/testregelUtils';
import { Testregel } from '@testreglar/api/types';
import { ActiveTest, ManuellTestStatus } from '@test/types';
import { elementOmtaleSide, ResultatManuellKontroll } from '@test/api/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Severity } from '@common/types';

type RaiseAlert = (severity: Severity, title: string, message: string) => void;

export interface TestregelSelectionActions {
  createResult: (
    testregel: Testregel,
    sideId: number | undefined,
    status?: ManuellTestStatus
  ) => void;
  updateStatus: (results: ResultatManuellKontroll[]) => void;
}

const getSelectedTestResults = (
  testResults: ResultatManuellKontroll[],
  testregelId: number,
  sideId: number
) =>
  testResults.filter(
    (tr) => tr.testregelId === testregelId && tr.sideutvalId === sideId
  );

const isSideElementTestregel = (testregelSchema: string) =>
  JSON.parse(testregelSchema).element.toLowerCase() === 'side';

const shouldCreateTestResult = (
  status: ManuellTestStatus,
  selected: ResultatManuellKontroll[]
) =>
  (status === 'under-arbeid' ||
    status === 'ikkje-forekomst' ||
    status === 'samsvar') &&
  isNotDefined(selected);

function shouldCloseActiveTest(status: ManuellTestStatus) {
  return (
    status === 'ferdig' || status === 'samsvar' || status === 'ikkje-forekomst'
  );
}

function canSetFerdigStatus(
  selected: ResultatManuellKontroll[],
  testregel: Testregel,
  raiseAlert: RaiseAlert
) {
  if (selected.some((tr) => isNotDefined(tr.element?.elementResultat))) {
    raiseAlert(
      'warning',
      'Kan ikkje sette status ferdig',
      'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
    );
    return false;
  }

  if (
    testregel.testregelSchema != null &&
    testregel.modus != 'manuell-forenkla'
  ) {
    if (
      isSideElementTestregel(testregel.testregelSchema) &&
      selected.some((tr) => !isDefined(tr.kommentar))
    ) {
      raiseAlert(
        'warning',
        'Kan ikkje sette status ferdig',
        'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
      );
      return false;
    }
  }

  return true;
}

export interface UseTestregelSelectionProps {
  testgrunnlagId: number;
  sideId: number;
  testResults: ResultatManuellKontroll[];
  testStatusMap: Map<string, ManuellTestStatus>;
  testreglarForLoeysing: Testregel[];
  activeTest: ActiveTest | undefined;
  setActiveTest: (test: ActiveTest | undefined) => void;
  testregelActions: TestregelSelectionActions;
  processData: (
    results: ResultatManuellKontroll[],
    sideId: number,
    testregel?: Testregel
  ) => void;
  raiseAlert: RaiseAlert;
}

export interface UseTestregelSelectionResult {
  onChangeTestregel: (testregelId: number) => void;
  onChangeTestregelStatus: (
    status: ManuellTestStatus,
    testregelId: number
  ) => void;
}




export const useTestregelSelection = ({
  testgrunnlagId,
  sideId,
  testResults,
  testStatusMap,
  testreglarForLoeysing,
  activeTest,
  setActiveTest,
  testregelActions,
  processData,
  raiseAlert,
}: UseTestregelSelectionProps): UseTestregelSelectionResult => {
  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      const nextTestregel = testreglarForLoeysing.find(
        (tr) => tr.id === testregelId
      );

      if (!nextTestregel) {
        raiseAlert(
          'danger',
          'Kan ikkje byta testregel',
          'Det oppstod ein feil ved byting av testregel'
        );
        return;
      }
      if (nextTestregel.id === activeTest?.testregel.id) {
        setActiveTest(undefined);
        return;
      }
      const statusKey = toTestregelStatusKey(
        testgrunnlagId,
        nextTestregel.id,
        sideId
      );
      if (testStatusMap.get(statusKey) === 'ikkje-starta') {
        testregelActions.createResult(nextTestregel, sideId);
      } else {
        processData(testResults, sideId, nextTestregel);
      }
    },
    [
      testreglarForLoeysing,
      testStatusMap,
      testResults,
      sideId,
      activeTest,
      testgrunnlagId,
      processData,
      testregelActions,
      raiseAlert,
      setActiveTest,
    ]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testregel = testreglarForLoeysing.find(
        (tr) => tr.id === testregelId
      );
      const selected = getSelectedTestResults(testResults, testregelId, sideId);

      if (
        !testregel ||
        illegalFinishedState(status, selected, testregel, raiseAlert)
      ) {
        return;
      }

      if (shouldCreateTestResult(status, selected)) {
        handleCreateNewTestResults(testregelActions, testregel, sideId, status, setActiveTest);
      }
      else {
        handleUpdateTestresults(status, selected, testregelId, testregelActions, activeTest, setActiveTest);
      }
    },
    [
      testreglarForLoeysing,
      testResults,
      sideId,
      activeTest,
      testregelActions,
      raiseAlert,
      setActiveTest,
    ]
  );

  return { onChangeTestregel, onChangeTestregelStatus };
};

function updateResultStatus(
  selected: ResultatManuellKontroll[],
  testregelId: number,
  status:
    ManuellTestStatus
) {
  return selected.map((tr) => ({
    ...tr,
    testregelId,
    status: mapStatus(status),
  }));
}

function updateResultatSideUtfall(
  status:
    ManuellTestStatus,
  selected: ResultatManuellKontroll[]
): ResultatManuellKontroll[] {
  if (status === 'samsvar' || status === 'ikkje-forekomst') {
    return selected.map((tr) => ({
      ...tr,
      elementResultat: status === 'samsvar' ? 'samsvar' : 'ikkjeForekomst',
      elementOmtale:elementOmtaleSide
    }));
  }
  return selected;
}

function illegalFinishedState(
  status:
    ManuellTestStatus,
  selected: ResultatManuellKontroll[],
  testregel: Testregel,
  raiseAlert: (severity: Severity, title: string, message: string) => void
) {
  return (
    status === 'ferdig' && !canSetFerdigStatus(selected, testregel, raiseAlert)
  );
}

function handleCreateNewTestResults(
  testregelActions: TestregelSelectionActions,
  testregel: Testregel,
  sideId: number,
  status: ManuellTestStatus,
  setActiveTest: (test: ActiveTest | undefined) => void
) {
  testregelActions.createResult(
    testregel,
    sideId,
    status === 'under-arbeid' ? undefined : status
  );
  if (shouldCloseActiveTest(status)) {
    setActiveTest(undefined);
  }
}
function handleUpdateTestresults(
  status: ManuellTestStatus,
  selected: ResultatManuellKontroll[],
  testregelId: number,
  testregelActions: TestregelSelectionActions,
  activeTest: ActiveTest | undefined,
  setActiveTest: (test: ActiveTest | undefined) => void
) {
  const updatedSideUtfall = updateResultatSideUtfall(status, selected);

  const updated = updateResultStatus(updatedSideUtfall, testregelId, status);

  testregelActions.updateStatus(updated);
  if (
    shouldCloseActiveTest(status) &&
    testregelId === activeTest?.testregel?.id
  ) {
    setActiveTest(undefined);
  }
}
