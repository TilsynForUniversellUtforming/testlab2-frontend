import { Chip, Heading } from '@digdir/designsystemet-react';

import classes from '../kontroll.module.css';
import { ModusFilter } from './types';

interface Props {
  heading: string;
  modus: ModusFilter;
  onChangeModus: (modus: ModusFilter) => void;
}

const TestregelFilter = ({ heading, modus, onChangeModus }: Props) => (
  <div className={classes.testregelFilter}>
    <Heading level={2} size="large" spacing>
      {heading}
    </Heading>
    <Heading level={3} size="small">
      Hva slags test skal du kjøre?
    </Heading>
    <Chip.Group>
      <Chip.Toggle
        selected={modus === 'manuell'}
        onClick={() => onChangeModus('manuell')}
        checkmark={false}
      >
        Manuell
      </Chip.Toggle>
      <Chip.Toggle
        selected={modus === 'automatisk'}
        onClick={() => onChangeModus('automatisk')}
        checkmark={false}
      >
        Automatisk
      </Chip.Toggle>
      <Chip.Toggle
        selected={modus === 'begge'}
        onClick={() => onChangeModus('begge')}
        checkmark={false}
      >
        Begge deler
      </Chip.Toggle>
    </Chip.Group>
  </div>
);

export default TestregelFilter;
