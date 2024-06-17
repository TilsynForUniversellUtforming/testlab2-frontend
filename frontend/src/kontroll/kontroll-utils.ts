import { KontrollType } from './types';

export const getKontrollIdFromParams = (
  kontrollIdString: string | undefined
): number => {
  const kontrollId = parseInt(kontrollIdString ?? '', 10);
  if (isNaN(kontrollId)) {
    throw new Error('Id-en i URL-en er ikke et tall');
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
