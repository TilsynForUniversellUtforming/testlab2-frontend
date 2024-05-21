import { Maaling } from '@maaling/api/types';
import { MaalingFormState } from '@maaling/types';
import { Verksemd } from '@verksemder/api/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { User } from '../../../user/api/types';

const toMaalingFormState = (
  verksemdList: Verksemd[],
  advisors: User[],
  maaling?: Maaling
): MaalingFormState => ({
  navn: maaling?.navn ?? '',
  loeysingList: maaling?.loeysingList
    ? maaling.loeysingList.map((l) => ({
        loeysing: l,
        verksemd: verksemdList[0],
      }))
    : [],
  loeysingSource: 'manuell',
  testregelList: maaling?.testregelList ? maaling.testregelList : [],
  maxLenker: maaling?.crawlParameters?.maxLenker
    ? maaling.crawlParameters.maxLenker
    : 100,
  talLenker: maaling?.crawlParameters?.talLenker
    ? maaling.crawlParameters.talLenker
    : 30,
  sakType: 'Forenklet kontroll',
  advisorId: advisors[0]?.id ? String(advisors[0].id) : undefined,
  sakNumber: undefined,
});

const useMaalingFormState = (
  maaling: Maaling | undefined,
  verksemdList: Verksemd[],
  advisors: User[]
): [MaalingFormState, Dispatch<SetStateAction<MaalingFormState>>] => {
  const [maalingFormState, setMaalingFormState] = useState<MaalingFormState>(
    toMaalingFormState(verksemdList, advisors, maaling)
  );

  useEffect(() => {
    setMaalingFormState(toMaalingFormState(verksemdList, advisors, maaling));
  }, [maaling, verksemdList, advisors]);

  return [maalingFormState, setMaalingFormState];
};

export default useMaalingFormState;
