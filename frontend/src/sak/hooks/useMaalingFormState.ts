import { useEffect, useState } from 'react';

import { Maaling } from '../../maaling/api/types';
import { User } from '../../user/api/types';
import { Verksemd } from '../../verksemder/api/types';
import { SakFormState } from '../types';

const toSakFormState = (
  verksemdList: Verksemd[],
  advisors: User[],
  maaling?: Maaling
): SakFormState => ({
  navn: maaling?.navn ?? '',
  loeysingList: maaling?.loeysingList
    ? maaling.loeysingList.map((l) => ({
        loeysing: l,
        verksemd: verksemdList[0],
      }))
    : [],
  testregelList: maaling?.testregelList ? maaling.testregelList : [],
  maxLinksPerPage: maaling?.crawlParameters?.maxLinksPerPage
    ? maaling.crawlParameters.maxLinksPerPage
    : 100,
  numLinksToSelect: maaling?.crawlParameters?.numLinksToSelect
    ? maaling.crawlParameters.numLinksToSelect
    : 30,
  sakType: 'Tilsyn',
  advisorId: advisors[0]?.id ? String(advisors[0].id) : undefined,
  sakNumber: undefined,
});

const useMaalingFormState = (
  maaling: Maaling | undefined,
  verksemdList: Verksemd[],
  advisors: User[]
): [SakFormState, React.Dispatch<React.SetStateAction<SakFormState>>] => {
  const [maalingFormState, setMaalingFormState] = useState<SakFormState>(
    toSakFormState(verksemdList, advisors, maaling)
  );

  useEffect(() => {
    setMaalingFormState(toSakFormState(verksemdList, advisors, maaling));
  }, [maaling, verksemdList, advisors]);

  return [maalingFormState, setMaalingFormState];
};

export default useMaalingFormState;
