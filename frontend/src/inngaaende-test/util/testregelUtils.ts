import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import {
  ManualElementResultat,
  ManualTestResultat,
  Svar,
} from '@test/api/types';
import { TestFormStep } from '@test/testregel-form/types';
import {
  PageType,
  SelectionOutcome,
  TestAnswers,
  TestregelOverviewElement,
  TestStatus,
  TestStep,
} from '@test/types';
import { Testregel } from '@testreglar/api/types';

export const getTestResultsForLoeysing = (
  testResults: ManualTestResultat[],
  loeysingId: number | undefined
): ManualTestResultat[] =>
  testResults.filter((tr) => tr.loeysingId === loeysingId);

export const isAllNonRelevant = (testResults: ManualTestResultat[]) =>
  testResults.length > 0 &&
  testResults.every(
    (tr) => tr.elementResultat && tr.elementResultat === 'ikkjeForekomst'
  );

export const progressionForLoeysingNettside = (
  sak: Sak,
  testResults: ManualTestResultat[],
  nettsideId: number,
  loeysingId: number | undefined
): number => {
  const numFinishedTestResults = testResults.filter(
    (tr) =>
      tr.loeysingId === loeysingId &&
      tr.nettsideId === nettsideId &&
      tr.elementResultat
  ).length;
  // TODO - Filtrer på valgt contentType, f.eks. alle testreglar med "IFrame"
  const numContentTestregel = sak.testreglar.length;

  return Math.round(numFinishedTestResults / numContentTestregel);
};

export const getNettsideProperties = (
  sak: Sak,
  loeysingId: number | undefined
): NettsideProperties[] =>
  sak.loeysingList.find((l) => loeysingId === l.loeysing.id)?.properties || [];

export const toPageType = (
  nettsideProperties: NettsideProperties[],
  nettsideId: number
): PageType => {
  const property =
    nettsideProperties.find((np) => np.id === nettsideId) ||
    nettsideProperties[0];

  if (isDefined(property?.id) && isDefined(property?.type)) {
    return { nettsideId: property.id, pageType: property.type };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

export const getInitialPageType = (
  nettsideProperties: NettsideProperties[]
): PageType => {
  const property =
    nettsideProperties.find((np) => np.type === 'forside') ||
    nettsideProperties[0];

  if (isDefined(property?.id) && isDefined(property?.type)) {
    return { nettsideId: property.id, pageType: property.type };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ManualTestResultat[],
  nettsideId: number
): Map<number, TestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      let status: TestStatus;
      const tr = testResults.find(
        (testResult) =>
          testResult.testregelId === testregel.id &&
          testResult.nettsideId === nettsideId
      );
      if (isNotDefined(tr)) {
        status = 'ikkje-starta';
      } else {
        if (
          isDefined(tr.elementResultat) &&
          isDefined(tr.elementOmtale) &&
          isDefined(tr.elementUtfall)
        ) {
          status = 'ferdig';
        } else {
          status = 'under-arbeid';
        }
      }

      return [testregel.id, status];
    })
  );

export const toTestregelOverviewElement = ({
  id,
  name,
  krav,
}: Testregel): TestregelOverviewElement => {
  // TODO - Bruk testregelId som name
  const regex = /^(\d+\.\d+\.\d+[a-zA-Z]?)\s+(.*)/;
  const result = name.match(regex);
  if (result && result.length === 3) {
    return { id: id, name: result[2], krav: result[1] };
  }

  return { id: id, name: name, krav: krav };
};

export const findActiveTestResult = (
  testResultsLoeysing: ManualTestResultat[],
  nettsideId: number | undefined,
  testregelId: number | undefined
): ManualTestResultat | undefined => {
  if (isNotDefined(nettsideId) || isNotDefined(testregelId)) {
    return undefined;
  }

  return testResultsLoeysing.find(
    (tr) => tr.nettsideId === nettsideId && tr.testregelId === testregelId
  );
};

export const convertToSvarArray = (steps: Map<string, TestStep>): Svar[] => {
  const answers: Svar[] = [];

  steps.forEach((testStep, key) => {
    if (testStep.answer) {
      answers.push({
        steg: key,
        svar: testStep.answer.svar,
      });
    }
  });

  return answers;
};

export const getNextSteps = (
  initStepKey: string,
  stepsMap: Map<string, TestStep>
): TestFormStep[] => {
  const nextSteps: TestFormStep[] = [{ key: initStepKey }];
  let nextStepKey: string = initStepKey;

  while (nextStepKey) {
    const currentStepData = stepsMap.get(nextStepKey);

    if (!currentStepData) {
      break;
    }

    const input = currentStepData.step.input;
    if (
      currentStepData.answer &&
      (input.inputType === 'radio' ||
        input.inputType === 'jaNei' ||
        input.inputSelectionOutcome.length > 1)
    ) {
      const answeredOutcome = input.inputSelectionOutcome.find(
        (outcome) => outcome.label === currentStepData.answer?.svar
      );
      if (!answeredOutcome) {
        break;
      }
      const nextStep = handleOutcome(answeredOutcome);
      nextSteps.push(nextStep);
      nextStepKey = nextStep.key;
    } else if (
      input.inputType === 'radio' ||
      input.inputType === 'jaNei' ||
      input.inputSelectionOutcome.length > 1
    ) {
      break;
    } else {
      const defaultStep = input.inputSelectionOutcome[0];
      const nextStep = handleOutcome(defaultStep);
      nextSteps.push(nextStep);
      nextStepKey = nextStep.key;
    }
  }

  return nextSteps;
};

const handleOutcome = (outcome: SelectionOutcome): TestFormStep => {
  switch (outcome.action) {
    case 'gaaTil':
      return { key: outcome.target };
    case 'ikkjeForekomst':
      return {
        key: outcome.action,
        utfall: outcome.utfall,
      };
    case 'avslutt':
      return {
        key: outcome.action,
        utfall: outcome.utfall,
        fasit: outcome.fasit,
      };
    default:
      throw Error('Ukjent type');
  }
};

export const getAnswersFromState = (
  steps: Map<string, TestStep>,
  selectionOutcome?: SelectionOutcome
): TestAnswers => {
  const answers: Svar[] = convertToSvarArray(steps);

  let elementResultat: ManualElementResultat | undefined = undefined;
  let elementUtfall: string | undefined = undefined;
  const elementOmtale: string | undefined = undefined;

  if (selectionOutcome) {
    if (selectionOutcome.action === 'avslutt') {
      elementUtfall = selectionOutcome.utfall;
      // elementOmtale = findElementOmtaleStep(steps) // TODO impl. funksjon for dette, bruk "element": "x.x" i testregel-json
      switch (selectionOutcome.fasit) {
        case 'Ja':
          elementResultat = 'samsvar';
          break;
        case 'Nei':
          elementResultat = 'brot';
          break;
        case 'Ikkje testbart':
          elementResultat = 'ikkjeTesta';
          break;
        case 'Ikkje forekomst':
          elementResultat = 'ikkjeForekomst';
          break;
        default:
          elementResultat = 'ikkjeTesta';
          break;
      }
    } else if (selectionOutcome.action === 'ikkjeForekomst') {
      elementUtfall = selectionOutcome.utfall;
      elementResultat = 'ikkjeForekomst';
    }
  }

  return {
    answers,
    elementOmtale,
    elementResultat,
    elementUtfall,
  };
};
