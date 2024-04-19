import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { Alert, Chip, Heading } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';

import classes from '../kontroll.module.css';

interface Props {
  heading: string;
  loeysingList: Loeysing[];
  selectedLoeysingId: number | undefined;
  onChangeLoeysing: (loeysingId: number) => void;
}

const LoeysingFilter = ({
  heading,
  loeysingList,
  selectedLoeysingId,
  onChangeLoeysing,
}: Props) => (
  <div className={classes.testregelFilter}>
    <Heading level={3} size="medium">
      {heading}
    </Heading>
    <Heading level={4} size="xsmall">
      Vel løysing til sideutval
    </Heading>
    <ConditionalComponentContainer
      condition={loeysingList.length > 0}
      conditionalComponent={
        <Chip.Group>
          {loeysingList.map((l) => (
            <Chip.Toggle
              key={l.id}
              selected={l.id === selectedLoeysingId}
              onClick={() => onChangeLoeysing(l.id)}
              checkmark
            >
              {l.namn}
            </Chip.Toggle>
          ))}
        </Chip.Group>
      }
      otherComponent={
        <Alert severity="warning">Kontroll har ikkje løysingsutval</Alert>
      }
    />
  </div>
);

export default LoeysingFilter;
