export type Feature = { key: string; active: boolean };

export function isActive(features: Feature[], key: string): boolean {
  return features?.find((f) => f.key === key)?.active ?? false;
}
