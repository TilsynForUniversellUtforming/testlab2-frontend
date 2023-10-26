export const joinStringsToList = (list: string[]): string => {
  if (list.length === 1) return list[0];
  const firsts = list.slice(0, list.length - 1);
  const last = list[list.length - 1];
  return firsts.join(', ') + ' og ' + last;
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const sanitizeLabel = (label: string) =>
  capitalize(label.replace('_', ' '));

export const extractDomain = (url?: string): string => {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    return urlObj.host;
  } catch (e) {
    return url;
  }
};

export const parseNumberInput = (value: number | string): number => {
  const numberValue = Number(value);
  if (!isNaN(numberValue)) {
    return numberValue;
  } else {
    throw Error('Ugyldig type');
  }
};

export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const format = new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return format.format(date);
};

export const removeSpaces = (s: string) => s.replace(/\s/g, '');
