import {dropWhile, first} from '@common/util/arrayUtils';
import {Svar} from '@test/api/types';
import {Delutfall} from '@test/util/testregel-interface/Delutfall';
import {
  Handling,
  HandlingAvslutt,
  HandlingFasitTyper,
  HandlingGaaTil,
  HandlingikkjeForekomst,
  HandlingRegler,
} from '@test/util/testregel-interface/Handling';
import {Regel} from '@test/util/testregel-interface/Regel';
import {Steg, StegJaNei, StegRadio, StegTekst,} from '@test/util/testregel-interface/Steg';
import {TestregelSchema} from '@test/util/testregel-interface/TestregelSchema';

export type TestregelForm = {
  steg: Steg[];
  delutfall: Record<number, Delutfall>;
  resultat?: TestregelResultat;
};

export type TestregelResultat = Avslutt | HandlingikkjeForekomst;

export type Avslutt = {
  type: 'avslutt';
  fasit: Exclude<HandlingFasitTyper, 'sjekkDelutfall'>;
  utfall: string;
};

type BesvartSteg = StegJaNei | StegRadio | StegTekst;

export function finnSvar(stegnr: string, alleSvar: Svar[]): string | undefined {
  return alleSvar.find((svar) => svar.steg === stegnr)?.svar;
}

export function evaluateTestregel(
  testregel: TestregelSchema | string,
  alleSvar: Svar[]
): TestregelForm {
  const parsedTestregel: TestregelSchema =
    typeof testregel === 'string' ? JSON.parse(testregel) : testregel;
  const stepsWithoutFirst = parsedTestregel.steg.slice(1);

  return loop({ steg: [], delutfall: [] }, stepsWithoutFirst, alleSvar);
}

const findGaaTilSteg = (resten: Steg[], nesteHandling: HandlingGaaTil) => {

  return dropWhile(resten, (step) => step.stegnr !== nesteHandling.steg);
}
const leggTilDelutfall = (testregelSkjema: TestregelForm, nesteHandling: HandlingGaaTil) => {
  const oppdaterteDelutfall = {...testregelSkjema.delutfall};
  if (nesteHandling.delutfall) {
    oppdaterteDelutfall[nesteHandling.delutfall.nr] =
        nesteHandling.delutfall;
  }
  return oppdaterteDelutfall;
}
const handlingGaaTil = (resten: Steg[], nesteHandling: HandlingGaaTil, testregelSkjema: TestregelForm, steg: BesvartSteg, alleSvar: Svar[]) => {
  const gjenvaerendeSteg = findGaaTilSteg(resten, nesteHandling);
  const oppdaterteDelutfall = leggTilDelutfall(testregelSkjema, nesteHandling);
  return loop(
      {
        ...testregelSkjema,
        steg: [...testregelSkjema.steg, steg],
        delutfall: oppdaterteDelutfall,
      },
      gjenvaerendeSteg,
      alleSvar
  );
}

function loop(
  testregelSkjema: TestregelForm,
  resterendeSteg: Steg[],
  alleSvar: Svar[]
): TestregelForm {
  if (resterendeSteg.length === 0) {
    return testregelSkjema;
  }

  const [steg, ...resten] = resterendeSteg;
  if (steg.type === 'instruksjon') {
    const acc_ = { ...testregelSkjema, steg: [...testregelSkjema.steg, steg] };
    return loop(acc_, resten, alleSvar);
  }

  const stegSvar = finnSvar(steg.stegnr, alleSvar);
  if (stegSvar) {
    return handleBesvartSteg(testregelSkjema, steg, resten, alleSvar);
  }

  return showNextSteg(testregelSkjema, resterendeSteg);
}

function handleBesvartSteg(
  testregelSkjema: TestregelForm,
  steg: BesvartSteg,
  resterendeSteg: Steg[],
  alleSvar: Svar[]
): TestregelForm {
  const nesteHandling = finnNesteHandling(steg, alleSvar, testregelSkjema.delutfall);
  if (!nesteHandling) {
    return testregelSkjema;
  }

  if (nesteHandling.type === 'gaaTil') {
    return handlingGaaTil(resterendeSteg, nesteHandling, testregelSkjema, steg, alleSvar);
  }

  if (nesteHandling.type === 'avslutt' || nesteHandling.type === 'ikkjeForekomst') {
    return closeTestregel(testregelSkjema, steg, nesteHandling);
  }

  return testregelSkjema;
}

function showNextSteg(
  testregelSkjema: TestregelForm,
  resterendeSteg: Steg[]
): TestregelForm {
  const nextStep = first(resterendeSteg);
  if (!nextStep) {
    return testregelSkjema;
  }
  return { ...testregelSkjema, steg: [...testregelSkjema.steg, nextStep] };
}

function closeTestregel(
  testregelSkjema: TestregelForm,
  steg: BesvartSteg,
  nesteHandling: HandlingAvslutt | HandlingikkjeForekomst
): TestregelForm {
  const resultat: TestregelResultat =
    nesteHandling.type === 'ikkjeForekomst'
      ? nesteHandling
      : insertDelutfall(nesteHandling, testregelSkjema.delutfall);

  return {
    ...testregelSkjema,
    steg: [...testregelSkjema.steg, steg],
    resultat,
  };
}

function finnNesteHandling(
  step: Steg,
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
): Exclude<Handling, HandlingRegler> | undefined {
  const ruting = step.ruting;
  if (ruting.alle) {
    return evaluateRutingType(ruting.alle, alleSvar, delutfall);
  }

  if (step.type === 'jaNei') {
    return evaluateJaNeiHandling(step, alleSvar, delutfall);
  }

  if (step.type === 'radio') {
    return evaluateRadioHandling(step, alleSvar, delutfall);
  }
}

function evaluateJaNeiHandling(
  step: Extract<Steg, { type: 'jaNei' }>,
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
): Exclude<Handling, HandlingRegler> | undefined {
  const { ja, nei } = step.ruting;
  if (!ja || !nei) {
    return;
  }

  const svar = finnSvar(step.stegnr, alleSvar)?.toLowerCase();
  if (!svar) {
    return;
  }

  return evaluateRutingType(svar === 'ja' ? ja : nei, alleSvar, delutfall);
}

function evaluateRadioHandling(
  step: Extract<Steg, { type: 'radio' }>,
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
): Exclude<Handling, HandlingRegler> | undefined {
  const svar = finnSvar(step.stegnr, alleSvar);
  if (!svar) {
    return;
  }

  const index = step.svarArray
    .map((s) => s.toUpperCase())
    .indexOf(svar.toUpperCase());
  const alt = `alt${index}`;

  // @ts-expect-error Den dynamiske sammenhengen mellom indeks i svararray og rutingalternativ har vi ikke klart å uttrykke i typene
  const handling = step.ruting[alt];
  if (!handling) {
    throw new Error(
      `Fant ikke rutingalternativ for steg ${step.stegnr} og svar ${svar}`
    );
  }

  return evaluateRutingType(handling, alleSvar, delutfall);
}

function evaluateRutingType(
  handling: Handling,
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
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
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
): Exclude<Handling, HandlingRegler> | undefined {
  const keys = Object.keys(regler);
  if (keys.length === 0) {
    return;
  }

  const key = Math.min(...keys.map((k) => Number.parseInt(k, 10)));
  const regel = regler[key];

  if (regelMatches(regel, alleSvar, delutfall)) {
    return evaluateRutingType(regel.handling, alleSvar, delutfall);
  }

  const { [key]: _, ...rest } = regler;
  return evaluateRutingRegler(rest, alleSvar, delutfall);
}

function regelMatches(
  regel: Regel,
  alleSvar: Svar[],
  delutfall: Record<number, Delutfall>
): boolean {
  switch (regel.type) {
    case 'lik': {
      const svar = finnSvar(regel.sjekk, alleSvar);
      return svar?.toUpperCase() === regel.verdi.toUpperCase();
    }
    case 'ulik': {
      const svar = finnSvar(regel.sjekk, alleSvar);
      return svar?.toUpperCase() !== regel.verdi.toUpperCase();
    }
    case 'mellom': {
      const svar = finnSvar(regel.sjekk, alleSvar);
      const verdi = Number.parseInt(svar ?? '', 10);
      return verdi >= regel.verdi && verdi <= regel.verdi2;
    }
    case 'talDersom': {
      const svar = alleSvar.filter(
        ({ steg, svar }) =>
          regel.sjekk.includes(steg) && svar.trim() === regel.verdi.trim()
      );
      return svar.length >= regel.mellom1 && svar.length <= regel.mellom2;
    }
    case 'vurderDelutfall': {
      const etDelutfall = delutfall[regel.id];
      return etDelutfall?.fasit === regel.verdi;
    }
    default:
      return false;
  }
}

const extractDelutfallFasit = (delutfall: Record<number, Delutfall>) => {
  return Object.entries(delutfall)
    .map(([_nr, d]) => d.fasit)
    .filter((fasit) => fasit === 'Ja' || fasit === 'Nei')
    .reduce(
      (acc: HandlingFasitTyper, delfasit) =>
        acc === 'Ja' && delfasit === 'Ja' ? 'Ja' : 'Nei',
      'Ja'
    );
};

function insertDelutfall(
  resultat: HandlingAvslutt,
  delutfall: Record<number, Delutfall>
): Avslutt {
  const fasit = resolveFasit(resultat, delutfall);
  const utfall = extractUtfallTekst(resultat.utfall, fasit);
  return {
    ...resultat,
    fasit,
    utfall: applyDelutfallPlaceholders(utfall, delutfall),
  };
}

function resolveFasit(
  resultat: HandlingAvslutt,
  delutfall: Record<number, Delutfall>
): Exclude<HandlingFasitTyper, 'sjekkDelutfall'> {
  if (resultat.fasit !== 'sjekkDelutfall') {
    return resultat.fasit;
  }
  return extractDelutfallFasit(delutfall);
}

function applyDelutfallPlaceholders(
  utfall: string,
  delutfall: Record<number, Delutfall>
): string {
  return Object.entries(delutfall).reduce((endeligUtfall, [_nr, etDelutfall]) => {
    return endeligUtfall
      .replace(`#delutfall(${etDelutfall.nr})`, etDelutfall.tekst)
      .replace(`#delutfall(${etDelutfall.nr},${etDelutfall.fasit})`, etDelutfall.tekst)
      .replace(new RegExp(String.raw`#delutfall\(${etDelutfall.nr},.+\)`, 'g'), '');
  }, utfall);
}

function extractUtfallTekst(
  utfall: HandlingAvslutt['utfall'],
  fasit: HandlingFasitTyper
): string {
  if (typeof utfall === 'string') {
    return utfall;
  }
  return fasit === 'Ja' ? (utfall.ja ?? '') : (utfall.nei ?? '');
}