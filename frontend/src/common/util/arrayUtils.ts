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

export function asList<T>(value: T | undefined): T[] {
  return value ? [value] : [];
}
