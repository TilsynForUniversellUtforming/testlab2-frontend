import { Heading, Ingress } from '@digdir/design-system-react';
import { nettsidePropertyOptions } from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';

import NettsidePropertiesFormInput from './NettsidePropertiesFormInput';

interface Props {
  heading: string;
  loeysingIndex: number;
}

const LoeysingNettsideForm = ({ heading, loeysingIndex }: Props) => {
  return (
    <>
      <Heading size="medium" level={5} spacing>
        {heading}
      </Heading>
      <Ingress size="medium" spacing>
        Velg standardsider for testen
      </Ingress>
      <div>
        <NettsidePropertiesFormInput
          heading="Forside"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties`}
          nameReason={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties`}
          options={nettsidePropertyOptions}
        />
      </div>
    </>
  );
};

export default LoeysingNettsideForm;
