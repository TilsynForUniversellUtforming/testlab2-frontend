import { Alert, Chip, Heading, Tag } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';

import classes from '../kontroll.module.css';
import { SideutvalBase } from './types';

interface Props {
  heading: string;
  loeysingList: Loeysing[];
  sideutvalKontroll: SideutvalBase[];
  selectedLoeysing: Loeysing | undefined;
  onChangeLoeysing: (loeysingId: number) => void;
}

const Filter = ({
  loeysingList,
  selectedLoeysing,
  onChangeLoeysing,
}: Omit<Props, 'heading' | 'sideutvalKontroll'>) => {
  if (loeysingList.length === 0) {
    return <Alert severity="warning">Kontroll har ikkje løysingsutval</Alert>;
  }

  return (
    <Chip.Group className={classes.sideutvalLoeysingChips}>
      {loeysingList.map((l) => (
        <Chip.Toggle
          key={l.id}
          selected={l.id === selectedLoeysing?.id}
          onClick={() => onChangeLoeysing(l.id)}
          checkmark
          id={`loeysing-${l.id}`}
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
  sideutvalKontroll,
  selectedLoeysing,
  onChangeLoeysing,
}: Props) => {
  const finished: Loeysing[] = loeysingList.filter((loeysing) =>
    sideutvalKontroll.some((sideutval) => sideutval.loeysingId === loeysing.id)
  );

  return (
    <div className={classes.loeysingFilter}>
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
      {finished.length > 0 && (
        <>
          <Heading level={3} size="medium">
            Ferdig
          </Heading>
          <div className={classes.ferdigUtval}>
            {finished.map((loeysing) => (
              <Tag color="first" size="medium" key={loeysing.id}>
                {loeysing.namn}
              </Tag>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoeysingFilter;
