import { isNotDefined } from '@common/util/validationUtils';

import { TestingStep, TestingStepInputType } from '../types';

const decodeHtmlEntities = (text: string): string => {
  const entities: { [key: string]: string } = {
    '&#x3C;': '<',
    '&#x3E;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&',
  };

  // Remove rich text formatting
  text.replace(/<[^>]*>/g, '');

  // Add spacing after punctiation if missing
  text = text.replace(/([,.!?;:])(?=\S)(?!$)/g, '$1 ');

  // Convert html-tags to readable text
  text.replace(
    /&#x3C;|&#x3E;|&quot;|&apos;|&amp;/g,
    (entity) => entities[entity]
  );

  return text;
};

const toValueLabelList = (
  inputType: TestingStepInputType,
  inputLabel?: string,
  svarArray?: string[]
): string[] => {
  if (inputType === 'tekst') {
    if (inputLabel) {
      return [inputLabel];
    }

    throw new Error('Manglar input label på tekstfelt');
  }

  if (inputType === 'jaNei') {
    return ['Ja', 'Nei'];
  }

  if (inputType === 'radio') {
    if (svarArray) {
      return svarArray;
    }

    throw new Error('Manglar input label på radio knappar');
  }

  return [];
};

// eslint-disable-next-line
const translateToTestingStep = (jsonData: any): Map<string, TestingStep> => {
  const stepMap = new Map<string, TestingStep>();

  // eslint-disable-next-line
  const sortedSteps = jsonData.steg.sort((a: any, b: any) => {
    const stegnrA = parseFloat(a.stegnr);
    const stegnrB = parseFloat(b.stegnr);
    return stegnrA - stegnrB;
  });

  // eslint-disable-next-line
  sortedSteps.forEach((step: any) => {
    const {
      stegnr,
      spm,
      ht,
      type: inputType,
      svarArray,
      label,
      oblig,
      ruting,
    } = step;

    const selectionOutcome = Object.entries(ruting).map(([_, route]) => {
      // eslint-disable-next-line
      const { type: action, steg, fasit, utfall } = route as any;

      switch (action) {
        case 'gaaTil':
          return { action: action, target: steg };
        case 'avslutt':
        case 'ikkjeForekomst':
          return { action: action, fasit, utfall };
        default:
          throw new Error('Ukjent type');
      }
    });

    const testingStep: TestingStep = {
      heading: decodeHtmlEntities(spm),
      description: decodeHtmlEntities(ht),
      input: {
        valueLabelList: toValueLabelList(inputType, label, svarArray),
        required: oblig || false,
      },
      selectionOutcome: selectionOutcome,
    };

    stepMap.set(stegnr, testingStep);
  });

  return stepMap;
};

export const parseJSONAndValidateSteg = (
  jsonString: string
): Map<string, TestingStep> => {
  const jsonData = JSON.parse(jsonString);

  if (isNotDefined(jsonData.steg)) {
    throw new Error('Testregel manglar steg');
  }

  return translateToTestingStep(jsonData);
};
