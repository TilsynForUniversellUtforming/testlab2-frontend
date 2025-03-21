import { TestlabSeverity } from '@common/types';
import { Resultat } from '@resultat/types';
import { RankingInfo, rankings, rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn, FilterMeta, Row } from '@tanstack/react-table';

import { KontrollType } from '../../kontroll/types';

/**
 * Function for adding sorting-prefix to the accessorFn for the react-table,
 * such that columns can be sorted by a different value in addition to
 * the column entry.
 * @param {number} sortingNumber - The sorting order number.
 * @param {string} heading - The original heading of the table.
 * @return {string} The heading prefixed with the sorting number and underscores.
 */
const headingWithSorting = (sortingNumber: number, heading: string): string =>
  `_${sortingNumber}_${heading}`;

/**
 * Removes the sorting-prefix from a table heading, and retrieve the original
 * heading from a sorted heading.
 * @param {string} sortHeading - The heading with the sorting prefix.
 * @return {string} The original heading without the sorting prefix.
 */
export const headingWithoutSorting = (sortHeading: string): string =>
  sortHeading.replace(/^_\d+_/, '');

export default headingWithSorting;

export const fuzzyFilter = <T extends object>(
  row: Row<T>,
  columnId: string,
  value: string,
  addMeta: (meta: FilterMeta) => void
) => {
  const itemRank: RankingInfo = rankItem(row.getValue(columnId), value, {
    threshold: rankings.CONTAINS,
  });

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const getSeverity = (percentage?: number): TestlabSeverity => {
  if (percentage == undefined) return 'neutral';
  if (percentage < 60) return 'danger';
  if (percentage < 90) return 'warning';
  if (percentage > 90) return 'success';
  return 'neutral';
};

export const scoreToPercentage = (score?: number): number | undefined => {
  if (score != undefined) return Math.round(score * 100);
  return undefined;
};

export const dateRangeFilter: FilterFn<Resultat> = (
  row: Row<Resultat>,
  columnId: string,
  filterValue: [number, number]
) => {
  const [min, max] = filterValue;
  const rowValue = Date.parse(row.getValue('dato'));

  const before = max ? rowValue < max : true;
  const after = min ? rowValue > min : true;

  return before && after;
};

export const findTypeKontroll = (value: string): KontrollType | undefined => {
  if (value.length < 2) return undefined;

  const types: KontrollType[] = [
    KontrollType.InngaaendeKontroll,
    KontrollType.ForenklaKontroll,
    KontrollType.Tilsyn,
    KontrollType.Statusmaaling,
    KontrollType.UttaleSak,
    KontrollType.Anna,
  ];

  return types
    .filter((type) => compareSearchStringTypeKontroll(value, type))
    .pop();
};

const compareSearchStringTypeKontroll = (
  value: string,
  typeKontroll: KontrollType
): boolean => {
  return typeKontroll.toLowerCase().startsWith(value.toLowerCase());
};
