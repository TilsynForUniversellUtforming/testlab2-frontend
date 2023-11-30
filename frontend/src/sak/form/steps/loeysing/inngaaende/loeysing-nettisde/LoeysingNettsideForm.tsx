import { Chip, Heading, Ingress } from '@digdir/design-system-react';
import NettsidePropertiesFieldArray from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/NettsidePropertiesFieldArray';

interface Props {
  heading: string;
  loeysingIndex: number;
  onClose: () => void;
}

const LoeysingNettsideForm = ({ heading, loeysingIndex, onClose }: Props) => (
  <>
    <Heading size="small" level={5} spacing>
      {heading}
    </Heading>
    <Ingress spacing>Velg standardsider for testen</Ingress>
    <div className="sak-loeysing__nettsted-wrapper">
      <Chip.Group
        size="small"
        className="sak-loeysing__nettsted-type-selection"
      >
        <Chip.Toggle selected checkmark={false}>
          Test av nettside
        </Chip.Toggle>
        <Chip.Toggle selected={false}>Test av mobil (kommer)</Chip.Toggle>
      </Chip.Group>
      <NettsidePropertiesFieldArray
        loeysingIndex={loeysingIndex}
        onClose={onClose}
      />
    </div>
  </>
);

export default LoeysingNettsideForm;
