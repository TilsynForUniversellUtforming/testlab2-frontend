export const joinStringsToList = (list: string[]): string => {
  if (list.length === 1) return list[0];
  const firsts = list.slice(0, list.length - 1);
  const last = list[list.length - 1];
  return firsts.join(', ') + ' og ' + last;
};
