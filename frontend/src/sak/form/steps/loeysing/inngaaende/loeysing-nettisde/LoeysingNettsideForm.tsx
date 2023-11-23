import { Chip, Heading, Ingress } from '@digdir/design-system-react';
import NettsidePropertiesFieldArray from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/NettsidePropertiesFieldArray';

interface Props {
  heading: string;
  loeysingIndex: number;
}

const LoeysingNettsideForm = ({ heading, loeysingIndex }: Props) => (
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
      <NettsidePropertiesFieldArray loeysingIndex={loeysingIndex} />
    </div>
  </>
);

export default LoeysingNettsideForm;
