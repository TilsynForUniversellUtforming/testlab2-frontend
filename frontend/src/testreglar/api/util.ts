import { RegelsettInnholdstype, TestregelModus } from '@testreglar/api/types';

export const filterList = <
  T extends { modus: TestregelModus; type: RegelsettInnholdstype },
>(
  list: T[],
  modus?: TestregelModus,
  type?: RegelsettInnholdstype
): T[] => {
  return filterByType(filterByModus(list, modus), type);
};

const filterByModus = <T extends { modus: TestregelModus }>(
  list: T[],
  modus?: TestregelModus
): T[] => {
  if (!modus) {
    return list;
  }

  return list.filter((item) => item.modus === modus);
};

const filterByType = <T extends { type: RegelsettInnholdstype }>(
  list: T[],
  type?: RegelsettInnholdstype
): T[] => {
  if (!type) {
    return list;
  }

  return list.filter((item) => item.type === type);
};
