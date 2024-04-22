import { Alert, Chip, Heading } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';

import classes from '../kontroll.module.css';

interface Props {
  heading: string;
  loeysingList: Loeysing[];
  selectedLoeysing: Loeysing | undefined;
  onChangeLoeysing: (loeysingId: number) => void;
}

const Filter = ({
  loeysingList,
  selectedLoeysing,
  onChangeLoeysing,
}: Omit<Props, 'heading'>) => {
  if (loeysingList.length === 0) {
    return <Alert severity="warning">Kontroll har ikkje løysingsutval</Alert>;
  }

  return (
    <Chip.Group>
      {loeysingList.map((l) => (
        <Chip.Toggle
          key={l.id}
          selected={l.id === selectedLoeysing?.id}
          onClick={() => onChangeLoeysing(l.id)}
          checkmark
        >
          {l.namn}
        </Chip.Toggle>
      ))}
    </Chip.Group>
  );
};

const LoeysingFilter = ({
  heading,
  loeysingList,
  selectedLoeysing,
  onChangeLoeysing,
}: Props) => (
  <div className={classes.testregelFilter}>
    <Heading level={3} size="medium">
      {heading}
    </Heading>
    <Heading level={4} size="xsmall">
      Vel løysing til sideutval
    </Heading>
    <Filter
      loeysingList={loeysingList}
      selectedLoeysing={selectedLoeysing}
      onChangeLoeysing={onChangeLoeysing}
    />
  </div>
);

export default LoeysingFilter;
