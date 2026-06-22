import { KontrollType } from './types';

export const getKontrollIdFromParams = (
  kontrollIdString: string | undefined
): number => {
  const kontrollId = Number.parseInt(kontrollIdString ?? '', 10);
  if (Number.isNaN(kontrollId)) {
    throw new TypeError('Id-en i URL-en er ikke et tall');
  }
  return kontrollId;
};

export function viewFilter(filter: KontrollType) {
  switch (filter) {
    case 'tilsyn':
      return 'Tilsyn';
    case 'inngaaende-kontroll':
      return 'Inngående kontroll';
    case 'uttalesak':
      return 'Uttale';
    case 'forenkla-kontroll':
      return 'Forenkla kontroll';
    case 'statusmaaling':
      return 'Statusmåling';
    case 'anna':
      return 'Anna';
  }
}
