import { Loeysing } from '@loeysingar/api/types';

export type Utval = {
  id: number;
  namn: string;
  oppretta: Date;
  loeysingar: Loeysing[];
};
