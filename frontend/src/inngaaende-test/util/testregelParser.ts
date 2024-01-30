import { drop, dropWhile, first, takeWhile } from '@common/util/arrayUtils';
import { capitalize } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';
import { Svar } from '@test/api/types';
import { Delutfall } from '@test/util/interface/Delutfall';
import {
  Handling,
  HandlingAvslutt,
  HandlingFasitTyper,
  HandlingikkjeForekomst,
  HandlingRegler,
} from '@test/util/interface/Handling';
import { Regel } from '@test/util/interface/Regel';
import { Steg } from '@test/util/interface/Steg';
import { Testregel } from '@test/util/interface/Testregel';

import {
  JaNeiType,
  ManualTestregel,
  RutingDTO,
  RutingType,
  SelectionOutcome,
  StegDTO,
  TargetType,
  TestingStepInputType,
  TestingStepProperties,
  TestregelDTO,
} from '../types';

export const parseHtmlEntities = (text: string): string => {
  const parser = new DOMParser();
  return (
    parser.parseFromString(text, 'text/html').body.textContent || text
  ).replace(/([,.!?:])(?=\S)(?!$)/g, '$1 '); // Add spacing after punctiation if missing
};

const toSelectedOutcome = (
  action: RutingType,
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

const translateToTestingStep = (testregel: TestregelDTO): ManualTestregel => {
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

  return { element: testregel.element, steps: stepMap };
};

export const parseTestregel = (jsonString: string): ManualTestregel => {
  const jsonData = JSON.parse(jsonString);

  if (isNotDefined(jsonData.steg)) {
    throw new Error('Testregel manglar steg');
  }

  return translateToTestingStep(jsonData);
};

export type Avslutt = {
  type: 'avslutt';
  fasit: Exclude<HandlingFasitTyper, 'sjekkDelutfall'>;
  utfall: string;
};

export type Resultat = Avslutt | HandlingikkjeForekomst;

export type SkjemaModell = {
  steg: Steg[];
  resultat?: Resultat;
  delutfall: Delutfall[];
};

export type AlleSvar = Svar[];

export function finnSvar(
  stegnr: string,
  alleSvar: AlleSvar
): string | undefined {
  return alleSvar.find((svar) => svar.steg === stegnr)?.svar;
}

export function lagSkjemaModell(
  testregel: Testregel | string,
  alleSvar: AlleSvar
): SkjemaModell {
  const parsedTestregel: Testregel =
    typeof testregel === 'string' ? JSON.parse(testregel) : testregel;
  const stepsWithoutFirst = parsedTestregel.steg.slice(1);

  return loop({ steg: [], delutfall: [] }, stepsWithoutFirst, alleSvar);
}

function finnNesteHandling(
  step: Steg,
  alleSvar: AlleSvar,
  delutfall: Delutfall[]
): Exclude<Handling, HandlingRegler> | undefined {
  const ruting = step.ruting;
  if (ruting.alle) {
    return evaluateRutingType(ruting.alle, alleSvar, delutfall);
  } else if (step.type === 'jaNei' && ruting.ja && ruting.nei) {
    const svar = finnSvar(step.stegnr, alleSvar)?.toLowerCase();
    if (svar) {
      return evaluateRutingType(
        svar === 'ja' ? ruting.ja : ruting.nei,
        alleSvar,
        delutfall
      );
    }
  } else if (step.type === 'radio') {
    const svar = finnSvar(step.stegnr, alleSvar);
    if (svar) {
      const index = step.svarArray
        .map((s) => s.toUpperCase())
        .indexOf(svar.toUpperCase());
      const alt = `alt${index}`;
      // @ts-expect-error Den dynamiske sammenhengen mellom indeks i svararray og rutingalternativ har vi ikke klart å uttrykke i typene
      const handling = ruting[alt];
      if (!handling) {
        throw new Error(
          `Fant ikke rutingalternativ for steg ${step.stegnr} og svar ${svar}`
        );
      }
      return evaluateRutingType(handling, alleSvar, delutfall);
    }
  }
}

function evaluateRutingType(
  handling: Handling,
  alleSvar: AlleSvar,
  delutfall: Delutfall[]
): Exclude<Handling, HandlingRegler> | undefined {
  switch (handling.type) {
    case 'avslutt':
    case 'ikkjeForekomst':
    case 'gaaTil':
      return handling;
    case 'regler':
      return evaluateRutingRegler(handling.regler, alleSvar, delutfall);
  }
}

function evaluateRutingRegler(
  regler: { [p: string]: Regel },
  alleSvar: AlleSvar,
  delutfall: Delutfall[]
): Exclude<Handling, HandlingRegler> | undefined {
  if (Object.keys(regler).length === 0) {
    return;
  }

  const key = Math.min(...Object.keys(regler).map((key) => parseInt(key, 10)));
  const regel = regler[key];
  if (regel.type === 'lik') {
    const svar = finnSvar(regel.sjekk, alleSvar);
    if (svar?.toUpperCase() === regel.verdi.toUpperCase()) {
      return evaluateRutingType(regel.handling, alleSvar, delutfall);
    } else {
      const { [key]: _, ...rest } = regler;
      return evaluateRutingRegler(rest, alleSvar, delutfall);
    }
  } else if (regel.type === 'ulik') {
    const svar = finnSvar(regel.sjekk, alleSvar);
    if (svar?.toUpperCase() !== regel.verdi.toUpperCase()) {
      return evaluateRutingType(regel.handling, alleSvar, delutfall);
    } else {
      const { [key]: _, ...rest } = regler;
      return evaluateRutingRegler(rest, alleSvar, delutfall);
    }
  } else if (regel.type === 'mellom') {
    const min = regel.verdi;
    const max = regel.verdi2;
    const svar = finnSvar(regel.sjekk, alleSvar);
    const verdi = parseInt(svar ?? '', 10);
    if (verdi >= min && verdi <= max) {
      return evaluateRutingType(regel.handling, alleSvar, delutfall);
    } else {
      const { [key]: _, ...rest } = regler;
      return evaluateRutingRegler(rest, alleSvar, delutfall);
    }
  } else if (regel.type === 'talDersom') {
    const svar = alleSvar.filter(
      ({ steg, svar }) =>
        regel.sjekk.includes(steg) && parseInt(svar, 10) === regel.verdi
    );
    if (svar.length >= regel.mellom1 && svar.length <= regel.mellom2) {
      return evaluateRutingType(regel.handling, alleSvar, delutfall);
    } else {
      const { [key]: _, ...rest } = regler;
      return evaluateRutingRegler(rest, alleSvar, delutfall);
    }
  } else if (regel.type === 'vurderDelutfall') {
    const { id, verdi, handling } = regel;
    const etDelutfall = delutfall[id];
    if (etDelutfall?.fasit === verdi) {
      return evaluateRutingType(handling, alleSvar, delutfall);
    } else {
      const { [key]: _, ...rest } = regler;
      return evaluateRutingRegler(rest, alleSvar, delutfall);
    }
  }
}

function insertDelutfall(
  resultat: HandlingAvslutt,
  delutfall: Delutfall[]
): Avslutt {
  const delutfallFasit = delutfall
    .map((d) => d.fasit)
    .filter((fasit) => fasit === 'Ja' || fasit === 'Nei')
    .reduce(
      (acc: HandlingFasitTyper, delfasit) =>
        acc === 'Ja' && delfasit === 'Ja' ? 'Ja' : 'Nei',
      'Ja'
    );
  const fasit =
    resultat.fasit === 'sjekkDelutfall' ? delutfallFasit : resultat.fasit;
  const utfall =
    typeof resultat.utfall === 'string'
      ? resultat.utfall
      : fasit === 'Ja'
        ? resultat.utfall.ja ?? ''
        : resultat.utfall.nei ?? '';
  const utfallMedDelutfall = delutfall.reduce((endeligUtfall, etDelutfall) => {
    return endeligUtfall.replace(
      `#delutfall(${etDelutfall.nr})`,
      etDelutfall.tekst
    );
  }, utfall);
  return { ...resultat, fasit, utfall: utfallMedDelutfall };
}

function loop(
  skjemaModell: SkjemaModell,
  alleSteg: Steg[],
  alleSvar: AlleSvar
): SkjemaModell {
  if (alleSteg.length === 0) {
    return skjemaModell;
  }

  const [steg, ...resten] = alleSteg;
  if (steg.type === 'instruksjon') {
    const acc_ = { ...skjemaModell, steg: [...skjemaModell.steg, steg] };
    return loop(acc_, resten, alleSvar);
  }

  const stegSvar = finnSvar(steg.stegnr, alleSvar);
  if (!stegSvar) {
    const rutingAlleGaaTil = takeWhile(alleSteg, (step) => {
      const tekst = step.type === 'tekst';
      const alleGaaTil = step.ruting?.alle?.type === 'gaaTil';
      return tekst && alleGaaTil;
    });
    const nextStep = first(drop(alleSteg, rutingAlleGaaTil.length));
    if (!nextStep) {
      return skjemaModell;
    }
    const steg = [...rutingAlleGaaTil, nextStep];
    return { ...skjemaModell, steg: [...skjemaModell.steg, ...steg] };
  } else {
    const nesteHandling = finnNesteHandling(
      steg,
      alleSvar,
      skjemaModell.delutfall
    );
    if (nesteHandling?.type === 'gaaTil') {
      const gjenvaerendeSteg = dropWhile(
        resten,
        (step) => step.stegnr !== nesteHandling.steg
      );
      const oppdaterteDelutfall = [...skjemaModell.delutfall];
      if (nesteHandling.delutfall) {
        oppdaterteDelutfall[nesteHandling.delutfall.nr] =
          nesteHandling.delutfall;
      }
      return loop(
        {
          ...skjemaModell,
          steg: [...skjemaModell.steg, steg],
          delutfall: oppdaterteDelutfall,
        },
        gjenvaerendeSteg,
        alleSvar
      );
    } else if (
      nesteHandling?.type === 'avslutt' ||
      nesteHandling?.type === 'ikkjeForekomst'
    ) {
      const resultat: Resultat =
        nesteHandling?.type === 'ikkjeForekomst'
          ? nesteHandling
          : insertDelutfall(nesteHandling, skjemaModell.delutfall);
      return {
        ...skjemaModell,
        steg: [...skjemaModell.steg, steg],
        resultat: resultat,
      };
    } else {
      return skjemaModell;
    }
  }
}
