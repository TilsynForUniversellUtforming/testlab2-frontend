import {
  editDistance,
  hasCapitalLetter,
  substrings,
} from '@common/util/stringutils';

export function first<T>(array: T[]): T | undefined {
  return array[0];
}

export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n);
}

export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

export function takeWhile<T>(array: T[], predicate: (t: T) => boolean): T[] {
  const result: T[] = [];
  for (const t of array) {
    if (predicate(t)) {
      result.push(t);
    } else {
      break;
    }
  }
  return result;
}

export function dropWhile<T>(array: T[], predicate: (t: T) => boolean): T[] {
  const result: T[] = [];
  let shouldDrop = true;
  for (const t of array) {
    if (!shouldDrop || !predicate(t)) {
      shouldDrop = false;
      result.push(t);
    }
  }
  return result;
}

export function isEmpty<T>(array: T[]): boolean {
  return array.length === 0;
}

export function hasSameItems<T>(
  as: T[],
  bs: T[],
  isEqual: (a: T, b: T) => boolean
): boolean {
  return (
    as.length === bs.length && as.every((a) => bs.some((b) => isEqual(a, b)))
  );
}

/**
 * Searches an array of objects, and returns an array of hits, sorted by the shortest distance between the search term
 * and the best matching substring in the selected field.
 * @param searchTerm The term you want to search for
 * @param selector A function from T to string, that returns the field you want to search
 * @param ts An array of objects
 */
export function search<T>(
  searchTerm: string,
  selector: (t: T) => string,
  ts: T[]
): T[] {
  if (searchTerm === '') {
    return ts;
  }

  const caseSensitive = hasCapitalLetter(searchTerm);
  const text = (t: T): string =>
    caseSensitive ? selector(t) : selector(t).toLocaleLowerCase('no-NO');

  return ts
    .map((t: T) => ({
      element: t,
      distance: Math.min(
        ...substrings(searchTerm.length, text(t)).map((s) =>
          editDistance(searchTerm, s)
        )
      ),
    }))
    .filter(({ distance }) => distance < searchTerm.length)
    .toSorted((a, b) =>
      a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0
    )
    .map(({ element }) => element);
}
