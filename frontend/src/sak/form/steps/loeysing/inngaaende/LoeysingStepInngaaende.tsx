import { ErrorMessage } from '@digdir/design-system-react';
import { LoeysingNettsideRelation } from '@sak/types';

import LoeysingNettsideRelationForm from '../../init/inngaaende/verksemd-loeysing-relation/LoeysingNettsideRelationForm';

interface Props {
  loeysingList?: LoeysingNettsideRelation[];
}

const LoeysingStepInngaaende = ({ loeysingList }: Props) => {
  if (!loeysingList) {
    return <ErrorMessage>Noko gjekk gale</ErrorMessage>;
  }

  return (
    <LoeysingNettsideRelationForm loeysingNettsideRelationList={loeysingList} />
  );
};

export default LoeysingStepInngaaende;
