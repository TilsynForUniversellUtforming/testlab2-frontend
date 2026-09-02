import { ElementResultat } from '@test/api/types';
import { TestregelResultat } from '@test/util/testregelParser';

export function mapUtfallToElementResultat(testresultat: string): ElementResultat {
  switch (testresultat) {
    case 'samsvar':
      return 'samsvar';
    case 'brot':
      return 'brot';
    case 'ikkje-forekomst':
      return 'ikkjeForekomst';
    case 'ikkje-testbar':
      return 'ikkjeTesta';
    default:
      return 'advarsel';
  }
}
export function mapToTestregelResultat(
  testresultat: string,
  utfall: string
): TestregelResultat {
  if (testresultat === 'ikkje-forekomst') {
    return { type: 'ikkjeForekomst', utfall };
  }

  return {
    type: 'avslutt',
    utfall,
    fasit: mapTestresultatToFasit(testresultat),
  };
}
export function mapTestresultatToFasit(
  testresultat: string
): 'Ja' | 'Nei' | 'Ikkje testbart' {
  switch (testresultat) {
    case 'samsvar':
      return 'Ja';
    case 'brot':
      return 'Nei';
    default:
      return 'Ikkje testbart';
  }
}