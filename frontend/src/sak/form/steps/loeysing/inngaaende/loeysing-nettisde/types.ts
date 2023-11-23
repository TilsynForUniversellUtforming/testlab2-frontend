import { SingleSelectOption } from '@digdir/design-system-react';

export type NettsidePropertyType =
  | 'forside'
  | 'navigasjonsmeny'
  | 'bilder_og_video'
  | 'overskrifter'
  | 'artikkelside'
  | 'skjema'
  | 'tabeller'
  | 'kapper'
  | 'egendefinert';

export const nettsidePropertyOptions: SingleSelectOption[] = [
  { label: 'Forside', value: 'forside' },
  { label: 'Navigasjonsmeny', value: 'navigasjonsmeny' },
  { label: 'Bilder og video', value: 'bilder_og_video' },
  { label: 'Overskrifter', value: 'overskrifter' },
  { label: 'Artikkelside', value: 'artikkelside' },
  { label: 'Skjema', value: 'skjema' },
  { label: 'Tabeller', value: 'tabeller' },
  { label: 'Kapper', value: 'kapper' },
  { label: 'Egendefinert', value: 'egendefinert' },
];
