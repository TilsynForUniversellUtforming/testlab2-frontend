import { Alert, Chip, Heading, Tag } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';

import classes from '../kontroll.module.css';

interface Props {
  heading: string;
  loeysingList: Loeysing[];
  finished: Loeysing[];
  selectedLoeysing: Loeysing | undefined;
  onChangeLoeysing: (loeysingId: number) => void;
}

const Filter = ({
  loeysingList,
  onChangeLoeysing,
}: Omit<Props, 'heading' | 'finished'>) => {
  if (loeysingList.length === 0) {
    return <Alert data-color="warning">Kontroll har ikkje løysingsutval</Alert>;
  }

  return (
    <div className={classes.sideutvalLoeysingChips}>
      {loeysingList.map((l) => (
        <Chip.Radio
          key={l.id}
          onClick={() => onChangeLoeysing(l.id)}
          id={`loeysing-${l.id}`}
        >
          {l.namn}
        </Chip.Radio>
      ))}
    </div>
  );
};

const LoeysingFilter = ({
  heading,
  loeysingList,
  finished,
  selectedLoeysing,
  onChangeLoeysing,
}: Props) => (
  <div className={classes.loeysingFilter}>
    <Heading level={3} data-size="md">
      {heading}
    </Heading>
    <Heading level={4} data-size="xs">
      Vel sideutval for løysing
    </Heading>
    <Filter
      loeysingList={loeysingList}
      selectedLoeysing={selectedLoeysing}
      onChangeLoeysing={onChangeLoeysing}
    />
    {finished.length > 0 && (
      <>
        <Heading level={3} data-size="md">
          Ferdig
        </Heading>
        <div className={classes.ferdigUtval}>
          {finished.map((loeysing) => (
            <Tag data-color="first" data-size="md" key={loeysing.id}>
              {loeysing.namn}
            </Tag>
          ))}
        </div>
      </>
    )}
  </div>
);

export default LoeysingFilter;
