const headingWithSorting = (sortingNumber: number, heading: string) =>
  `_${sortingNumber}_${heading}`;

export const headingWithoutSorting = (sortHeading: string) =>
  sortHeading.replace(/^_\d+_/, '');

export default headingWithSorting;
