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
