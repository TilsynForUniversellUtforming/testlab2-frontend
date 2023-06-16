export const joinStringsToList = (list: string[]): string => {
  if (list.length === 1) return list[0];
  const firsts = list.slice(0, list.length - 1);
  const last = list[list.length - 1];
  return firsts.join(', ') + ' og ' + last;
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const sanitizeLabel = (label: string) =>
  capitalize(label.replace('_', ' ').toLowerCase());

export const extractDomain = (url?: string): string => {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    return urlObj.host;
  } catch (e) {
    return url;
  }
};
