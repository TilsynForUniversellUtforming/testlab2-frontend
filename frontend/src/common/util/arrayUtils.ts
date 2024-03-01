export function first<T>(array: T[]): T | undefined {
  return array[0];
}

export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n);
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
