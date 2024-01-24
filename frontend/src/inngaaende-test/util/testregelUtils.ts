import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import {
  ElementResultat,
  ResultatManuellKontroll,
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
  testResults: ResultatManuellKontroll[],
  loeysingId: number | undefined
): ResultatManuellKontroll[] =>
  testResults.filter((tr) => tr.loeysingId === loeysingId);

// export const isAllNonRelevant = (testResults: ManualTestResultat[]) =>
//   testResults.length > 0 &&
//   testResults.every(
//     (tr) => tr.elementResultat && tr.elementResultat === 'ikkjeForekomst'
//   );

export const progressionForLoeysingNettside = (
  sak: Sak,
  testResults: ResultatManuellKontroll[],
  nettsideId: number,
  loeysingId: number | undefined
): number => {
  const numFinishedTestResults = testResults.filter(
    (tr) =>
      tr.loeysingId === loeysingId && tr.nettsideId === nettsideId && tr.ferdig
  ).length;

  // TODO - Filtrer på valgt contentType, f.eks. alle testreglar med "IFrame"
  const numContentTestregel = sak.testreglar.length;

  return Math.round((numFinishedTestResults / numContentTestregel) * 100);
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

export const toTestregelStatusKey = (
  sakId: number,
  loeysingId: number,
  testregelId: number,
  nettsideId: number
) => [sakId, loeysingId, testregelId, nettsideId].join('_');

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ResultatManuellKontroll[],
  sakId: number,
  loeysingId: number,
  nettsideId: number
): Map<string, TestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      let status: TestStatus;
      const tr = findActiveTestResult(
        testResults,
        sakId,
        loeysingId,
        testregel.id,
        nettsideId
      );
      if (isNotDefined(tr)) {
        status = 'ikkje-starta';
      } else {
        if (tr.ferdig) {
          status = 'ferdig';
        } else {
          status = 'under-arbeid';
        }
      }

      return [
        toTestregelStatusKey(sakId, loeysingId, testregel.id, nettsideId),
        status,
      ];
    })
  );

export const toTestregelOverviewElement = ({
  id,
  name,
  krav,
}: Testregel): TestregelOverviewElement => {
  // TODO - Bruk testregelId som name
  const regex = /^((Nett-)?\d+\.\d+\.\d+([a-z])?)\s+(.*)$/;
  const result = name.match(regex);

  if (result && result.length > 3) {
    const firstPart = result[1];
    const secondPart = result[4];
    return { id: id, name: secondPart, krav: firstPart };
  }

  return { id: id, name: name, krav: krav };
};

export const findActiveTestResult = (
  testResultsLoeysing: ResultatManuellKontroll[],
  sakId: number | undefined,
  loeysingId: number | undefined,
  testregelId: number | undefined,
  nettsideId: number | undefined
): ResultatManuellKontroll | undefined => {
  if (!sakId || !loeysingId || !testregelId || !nettsideId) {
    throw Error('Kan ikkje finne testresultat for sak');
  }

  return testResultsLoeysing.find(
    (tr) =>
      tr.sakId === sakId &&
      tr.loeysingId === loeysingId &&
      tr.testregelId === testregelId &&
      tr.nettsideId === nettsideId
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

  let elementResultat: ElementResultat | undefined = undefined;
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
