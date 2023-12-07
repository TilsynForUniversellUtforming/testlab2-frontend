import { capitalize } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';

import {
  JaNeiType,
  RutingDTO,
  SelectionOutcome,
  StegDTO,
  TargetType,
  TestingRouteActionType,
  TestingStep,
  TestingStepInputType,
  TestregelDTO,
} from '../types';

const decodeHtmlEntities = (text: string): string => {
  const entities: { [key: string]: string } = {
    '&lt;': '<',
    '&gt;': '>',
    '&#x3C;': '<',
    '&#x3E;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&',
  };

  return text
    .replace(/<[^>]*>/g, '') // Remove rich text formatting
    .replace(/([,.!?:])(?=\S)(?!$)/g, '$1 ') // Add spacing after punctiation if missing
    .replace(
      // Convert html-tags to readable text
      /&#x3C;|&#x3E;|&quot;|&apos;|&amp;|&lt;|&gt;/g,
      (entity) => entities[entity]
    );
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
): Map<string, TestingStep> => {
  const stepMap = new Map<string, TestingStep>();

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

    const testingStep: TestingStep = {
      heading: decodeHtmlEntities(spm),
      description: decodeHtmlEntities(ht),
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
): Map<string, TestingStep> => {
  const jsonData = JSON.parse(jsonString);

  if (isNotDefined(jsonData.steg)) {
    throw new Error('Testregel manglar steg');
  }

  return translateToTestingStep(jsonData);
};
