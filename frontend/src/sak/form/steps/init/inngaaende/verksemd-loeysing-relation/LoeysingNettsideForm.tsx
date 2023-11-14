import { Heading, Ingress } from '@digdir/design-system-react';

import NettsidePropertiesFormInput from './NettsidePropertiesFormInput';

interface Props {
  heading: string;
  index: number;
}

const LoeysingNettsideForm = ({ heading, index }: Props) => {
  return (
    <>
      <Heading size="medium" level={5} spacing>
        {heading}
      </Heading>
      <Ingress size="medium" spacing>
        Velg standardsider for testen
      </Ingress>
      <div className="sak-loeysing__nettsted-props">
        <NettsidePropertiesFormInput
          heading="Forside"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.forside.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.forside.description`}
        />
        <NettsidePropertiesFormInput
          heading="Navigasjonsmeny"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.navigasjonsmeny.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.navigasjonsmeny.description`}
        />
      </div>
      <div className="sak-loeysing__nettsted-props">
        <NettsidePropertiesFormInput
          heading="Side med mange bilder og video"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.bilder.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.bilder.description`}
        />
        <NettsidePropertiesFormInput
          heading="Overskrifter"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.overskrifter.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.overskrifter.description`}
        />
      </div>
      <div className="sak-loeysing__nettsted-props">
        <NettsidePropertiesFormInput
          heading="Artikkelside"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.artikkel.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.artikkel.description`}
        />
        <NettsidePropertiesFormInput
          heading="Skjema"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.skjema.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.skjema.description`}
        />
      </div>
      <div className="sak-loeysing__nettsted-props">
        <NettsidePropertiesFormInput
          heading="Side med tabeller"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.tabell.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.tabell.description`}
        />
        <NettsidePropertiesFormInput
          heading="Knapper"
          nameUrl={`verksemdLoeysingRelation.loeysingList.${index}.knapper.url`}
          nameDescription={`verksemdLoeysingRelation.loeysingList.${index}.knapper.description`}
        />
      </div>
    </>
  );
};

export default LoeysingNettsideForm;
