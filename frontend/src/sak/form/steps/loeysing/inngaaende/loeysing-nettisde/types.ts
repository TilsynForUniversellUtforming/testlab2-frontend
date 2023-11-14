import { SingleSelectOption } from '@digdir/design-system-react';

export type NettsidePropertyType =
  | 'forside'
  | 'navigasjonsmeny'
  | 'bilder'
  | 'overskrifter'
  | 'artikkel'
  | 'skjema'
  | 'tabell'
  | 'knapper';

export const nettsidePropertyOptions: SingleSelectOption[] = [
  { label: 'Forside', value: 'forside' },
  { label: 'Navigasjonsmeny', value: 'navigasjonsmeny' },
  { label: 'Bilder og video', value: 'bilder' },
  { label: 'Overskrifter', value: 'overskrifter' },
  { label: 'Artikkelside', value: 'artikkel' },
  { label: 'Skjema', value: 'skjema' },
  { label: 'Tabeller', value: 'tabell' },
  { label: 'Kapper', value: 'knapper' },
  { label: 'Ingen', value: '' },
];
