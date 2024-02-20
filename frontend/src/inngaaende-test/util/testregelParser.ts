import { dropWhile, first } from '@common/util/arrayUtils';
import { ElementResultat, Svar } from '@test/api/types';
import { Delutfall } from '@test/util/testregel-interface/Delutfall';
import {
  Handling,
  HandlingAvslutt,
  HandlingFasitTyper,
  HandlingikkjeForekomst,
  HandlingRegler,
} from '@test/util/testregel-interface/Handling';
import { Regel } from '@test/util/testregel-interface/Regel';
import { Steg } from '@test/util/testregel-interface/Steg';
import { Testregel } from '@test/util/testregel-interface/Testregel';

export type TestregelSkjema = {
  steg: Steg[];
  delutfall: Delutfall[];
  resultat?: TestregelResultat;
};

export type TestregelResultat = Avslutt | HandlingikkjeForekomst;

export type Avslutt = {
  type: 'avslutt';
  fasit: Exclude<HandlingFasitTyper, 'sjekkDelutfall'>;
  utfall: string;
};

export function toElementResultat(
  resultat: TestregelResultat
): ElementResultat {
  if (resultat.type === 'avslutt') {
    switch (resultat.fasit) {
      case 'Ja':
        return 'samsvar';
      case 'Nei':
        return 'brot';
      case 'Ikkje testbart':
        return 'ikkjeTesta';
    }
  } else {
    return 'ikkjeForekomst';
  }
}

export function finnSvar(stegnr: string, alleSvar: Svar[]): string | undefined {
  return alleSvar.find((svar) => svar.steg === stegnr)?.svar;
}

export function evaluateTestregel(
  testregel: Testregel | string,
  alleSvar: Svar[]
): TestregelSkjema {
  const parsedTestregel: Testregel =
    typeof testregel === 'string' ? JSON.parse(testregel) : testregel;
  const stepsWithoutFirst = parsedTestregel.steg.slice(1);

  return loop({ steg: [], delutfall: [] }, stepsWithoutFirst, alleSvar);
}

function loop(
  testregelSkjema: TestregelSkjema,
  resterendeSteg: Steg[],
  alleSvar: Svar[]
): TestregelSkjema {
  if (resterendeSteg.length === 0) {
    return testregelSkjema;
  }

  const [steg, ...resten] = resterendeSteg;
  if (steg.type === 'instruksjon') {
    const acc_ = { ...testregelSkjema, steg: [...testregelSkjema.steg, steg] };
    return loop(acc_, resten, alleSvar);
  }

  const stegSvar = finnSvar(steg.stegnr, alleSvar);
  if (!stegSvar) {
    const nextStep = first(resterendeSteg);
    if (!nextStep) {
      return testregelSkjema;
    }
    const steg = [nextStep];
    return { ...testregelSkjema, steg: [...testregelSkjema.steg, ...steg] };
  } else {
    const nesteHandling = finnNesteHandling(
      steg,
      alleSvar,
      testregelSkjema.delutfall
    );
    if (nesteHandling?.type === 'gaaTil') {
      const gjenvaerendeSteg = dropWhile(
        resten,
        (step) => step.stegnr !== nesteHandling.steg
      );
      const oppdaterteDelutfall = [...testregelSkjema.delutfall];
      if (nesteHandling.delutfall) {
        oppdaterteDelutfall[nesteHandling.delutfall.nr] =
          nesteHandling.delutfall;
      }
      return loop(
        {
          ...testregelSkjema,
          steg: [...testregelSkjema.steg, steg],
          delutfall: oppdaterteDelutfall,
        },
        gjenvaerendeSteg,
        alleSvar
      );
    } else if (
      nesteHandling?.type === 'avslutt' ||
      nesteHandling?.type === 'ikkjeForekomst'
    ) {
      const resultat: TestregelResultat =
        nesteHandling?.type === 'ikkjeForekomst'
          ? nesteHandling
          : insertDelutfall(nesteHandling, testregelSkjema.delutfall);
      return {
        ...testregelSkjema,
        steg: [...testregelSkjema.steg, steg],
        resultat: resultat,
      };
    } else {
      return testregelSkjema;
    }
  }
}

function finnNesteHandling(
  step: Steg,
  alleSvar: Svar[],
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
  alleSvar: Svar[],
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
  alleSvar: Svar[],
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
        regel.sjekk.includes(steg) && svar.trim() === regel.verdi.trim()
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
    return endeligUtfall
      .replace(`#delutfall(${etDelutfall.nr})`, etDelutfall.tekst)
      .replace(
        `#delutfall(${etDelutfall.nr},${etDelutfall.fasit})`,
        etDelutfall.tekst
      )
      .replace(new RegExp(`#delutfall\\(${etDelutfall.nr},.+\\)`, 'g'), '');
  }, utfall);
  return { ...resultat, fasit, utfall: utfallMedDelutfall };
}
