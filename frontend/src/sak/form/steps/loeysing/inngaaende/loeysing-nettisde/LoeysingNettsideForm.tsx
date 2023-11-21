import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, Chip, Heading, Ingress } from '@digdir/design-system-react';
import { MinusCircleIcon } from '@navikt/aksel-icons';
import { useCallback, useState } from 'react';

import NettsidePropertiesFormInput from './NettsidePropertiesFormInput';

interface Props {
  heading: string;
  loeysingIndex: number;
}

const LoeysingNettsideForm = ({ heading, loeysingIndex }: Props) => {
  const [propertiesLength, setPropertiesLength] = useState(1);

  const onClickAdd = useCallback(() => {
    setPropertiesLength((propertiesLength) => propertiesLength + 1);
  }, [setPropertiesLength]);

  const onClickRemove = useCallback(() => {
    setPropertiesLength((propertiesLength) => propertiesLength - 1);
  }, [setPropertiesLength]);

  return (
    <>
      <Heading size="medium" level={5} spacing>
        {heading}
      </Heading>
      <Ingress size="medium" spacing>
        Velg standardsider for testen
      </Ingress>
      <div>
        <Chip.Group size="small">
          <Chip.Toggle selected>Test av nettside</Chip.Toggle>
          <Chip.Toggle selected={false}>Test av mobil (kommer)</Chip.Toggle>
        </Chip.Group>
        <br />
        {Array(propertiesLength)
          .fill(undefined)
          .map((_, propertyIndex) => (
            <div
              key={`${loeysingIndex}_properties_${propertyIndex}`}
              className="sak-loeysing__nettsted-props"
            >
              <NettsidePropertiesFormInput
                isWeb
                onClickAdd={onClickAdd}
                nextPropertyPath={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${propertiesLength}`}
                nameType={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${propertyIndex}.type`}
                nameUrl={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${propertyIndex}.url`}
                nameReason={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${propertyIndex}.reason`}
                nameDescription={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${propertyIndex}.description`}
              />
              <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Quiet}
                type="button"
                onClick={onClickRemove}
                icon={<MinusCircleIcon />}
              >
                Fjern side
              </Button>
              <br />
            </div>
          ))}
      </div>
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Outline}
        type="button"
        onClick={onClickAdd}
      >
        Legg til side
      </Button>
    </>
  );
};

export default LoeysingNettsideForm;
