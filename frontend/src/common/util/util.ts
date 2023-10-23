export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const format = new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return format.format(date);
};

export const isDefined = <T>(value: T | undefined | null): value is T => {
  if (typeof value === 'string') {
    return value.length > 0;
  }

  if (typeof value === 'number') {
    return !isNaN(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((e) => isDefined(e));
  }

  if (typeof value === 'object') {
    return value !== null && Object.keys(value).length > 0;
  }

  return value != null;
};

export const isNotDefined = <T>(value: T | undefined | null): value is T =>
  !isDefined(value);

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeSpaces = (s: string) => s.replace(/\s/g, '');

export function isOrgnummer(s: string): boolean {
  const utenMellomrom = removeSpaces(s);
  if (utenMellomrom.length !== 9) {
    return false;
  }

  const sifferListe = utenMellomrom.split('').map((c) => parseInt(c));
  if (sifferListe.some((n) => isNaN(n))) {
    return false;
  }

  const vekter = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = sifferListe
    .slice(0, 8)
    .reduce((acc, curr, i) => acc + curr * vekter[i], 0);
  const rest = sum % 11;
  const kontrollsiffer = rest === 0 ? 0 : 11 - rest;
  return kontrollsiffer === sifferListe[8];
}
