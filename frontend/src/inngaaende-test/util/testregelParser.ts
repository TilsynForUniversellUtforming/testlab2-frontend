import { capitalize } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';
import { Svar } from '@test/api/types';

import {
  JaNeiType,
  RutingDTO,
  SelectionOutcome,
  StegDTO,
  TargetType,
  TestingRouteActionType,
  TestingStepInputType,
  TestingStepProperties,
  TestregelDTO,
  TestStep,
} from '../types';

const parseHtmlEntities = (text: string): string => {
  const parser = new DOMParser();
  return (
    parser.parseFromString(text, 'text/html').body.textContent || text
  ).replace(/([,.!?:])(?=\S)(?!$)/g, '$1 '); // Add spacing after punctiation if missing
};

const toSelectedOutcome = (
  action: TestingRouteActionType,
  label: string,
  steg: TargetType,
  fasit: string,
  utfall: string
): SelectionOutcome => {
  switch (action) {
    case 'gaaTil':
      return { label: label, action: action, target: steg };
    case 'avslutt':
    case 'ikkjeForekomst':
      return { label: label, action: action, fasit, utfall };
    default:
      throw new Error('Ukjent ruting type');
  }
};

const handleTekst = (
  ruting: RutingDTO,
  inputLabel: string = ''
): SelectionOutcome[] => {
  if (ruting['alle']) {
    const route = ruting['alle'];
    const { type: action, steg, fasit, utfall } = route;

    return [toSelectedOutcome(action, inputLabel, steg, fasit, utfall)];
  }

  return [];
};

const handleInstruksjon = (ruting: RutingDTO): SelectionOutcome[] =>
  handleTekst(ruting);

const handleJaNei = (ruting: RutingDTO): SelectionOutcome[] => {
  const jaNeiArray: JaNeiType[] = ['ja', 'nei'];

  return jaNeiArray.map((key) => {
    const route = ruting['alle'] ? ruting['alle'] : ruting[key];
    const { type: action, steg, fasit, utfall } = route;

    return toSelectedOutcome(action, capitalize(key), steg, fasit, utfall);
  });
};

const handleRadio = (
  ruting: RutingDTO,
  svarArray: string[]
): SelectionOutcome[] => {
  if (ruting['alle']) {
    const route = ruting['alle'];
    const { type: action, steg, fasit, utfall } = route;
    return svarArray.map((label) => {
      return toSelectedOutcome(action, label, steg, fasit, utfall);
    });
  }

  return Object.entries(ruting).map(([key, route]) => {
    const index = parseInt(key.replace('alt', ''), 10);
    const { type: action, steg, fasit, utfall } = route;

    return toSelectedOutcome(action, svarArray[index], steg, fasit, utfall);
  });
};

const toInputSelectionOutcome = (
  inputType: TestingStepInputType,
  ruting: RutingDTO,
  inputLabel: string = '',
  svarArray: string[] = []
): SelectionOutcome[] => {
  switch (inputType) {
    case 'radio':
      return handleRadio(ruting, svarArray);
    case 'jaNei':
      return handleJaNei(ruting);
    case 'instruksjon':
      return handleInstruksjon(ruting);
    case 'tekst':
    case 'multiline':
      return handleTekst(ruting, inputLabel);
  }
};

const translateToTestingStep = (
  testregel: TestregelDTO
): Map<string, TestingStepProperties> => {
  const stepMap = new Map<string, TestingStepProperties>();

  const stepsWithoutFirst = testregel.steg.slice(1);

  stepsWithoutFirst.forEach((step: StegDTO) => {
    const {
      stegnr,
      spm,
      ht,
      type,
      svarArray,
      label,
      oblig,
      ruting,
      multilinje,
    } = step;

    const inputType: TestingStepInputType = multilinje ? 'multiline' : type;

    const testingStep: TestingStepProperties = {
      heading: parseHtmlEntities(spm),
      description: parseHtmlEntities(ht),
      input: {
        inputType: inputType,
        required: oblig || false,
        inputSelectionOutcome: toInputSelectionOutcome(
          inputType,
          ruting,
          label,
          svarArray
        ),
      },
    };

    stepMap.set(stegnr, testingStep);
  });

  return stepMap;
};

export const parseTestregel = (
  jsonString: string
): Map<string, TestingStepProperties> => {
  const jsonData = JSON.parse(jsonString);

  if (isNotDefined(jsonData.steg)) {
    throw new Error('Testregel manglar steg');
  }

  return translateToTestingStep(jsonData);
};

export const combineStepsAndAnswers = (
  testSteps: Map<string, TestingStepProperties>,
  answers?: Svar[]
): Map<string, TestStep> => {
  const testStepsWithAnswers = new Map<string, TestStep>();

  testSteps.forEach((testingStepProperties, key) => {
    const answer = answers?.find((answer) => answer.steg === key);

    const testStep: TestStep = {
      step: testingStepProperties,
      answer: answer,
    };

    testStepsWithAnswers.set(key, testStep);
  });

  return testStepsWithAnswers;
};
