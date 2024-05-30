import { Card, Chip, Heading } from '@digdir/designsystemet-react';
import { RegelsettInnholdstype, TestregelModus } from '@testreglar/api/types';

import classes from '../kontroll.module.css';

interface Props {
  modus: TestregelModus;
  type: RegelsettInnholdstype;
  onChangeFilter: (modus: TestregelModus, type: RegelsettInnholdstype) => void;
  regelsettSelected: boolean;
}

const TestregelFilter = ({
  modus,
  type,
  onChangeFilter,
  regelsettSelected,
}: Props) => (
  <Card level={3} size="small" className={classes.testregelFilter}>
    <Card.Header>
      <Heading level={4} size="small">
        Kva slags test skal du køyra?
      </Heading>
    </Card.Header>
    <Heading level={5} size="xsmall">
      Vel modus for test
    </Heading>
    <Chip.Group>
      <Chip.Toggle
        selected={modus === 'manuell'}
        onClick={() => onChangeFilter('manuell', type)}
        checkmark={false}
      >
        Manuell
      </Chip.Toggle>
      <Chip.Toggle
        selected={modus === 'automatisk'}
        onClick={() => onChangeFilter('automatisk', type)}
        checkmark={false}
      >
        Automatisk
      </Chip.Toggle>
      <Chip.Toggle
        selected={modus === 'semi-automatisk'}
        onClick={() => onChangeFilter('semi-automatisk', type)}
        checkmark={false}
      >
        Begge deler
      </Chip.Toggle>
    </Chip.Group>
    <Heading level={5} size="xsmall">
      Vel type for test
    </Heading>
    <Chip.Group>
      <Chip.Toggle
        selected={type === 'nett'}
        onClick={() => onChangeFilter(modus, 'nett')}
        checkmark={false}
      >
        Nett
      </Chip.Toggle>
      <Chip.Toggle
        selected={type === 'app'}
        onClick={() => onChangeFilter(modus, 'app')}
        checkmark={false}
      >
        App
      </Chip.Toggle>
      <Chip.Toggle
        selected={type === 'automat'}
        onClick={() => onChangeFilter(modus, 'automat')}
        checkmark={false}
      >
        Automat
      </Chip.Toggle>
      <Chip.Toggle
        selected={type === 'dokument'}
        onClick={() => onChangeFilter(modus, 'dokument')}
        checkmark={false}
      >
        Dokument
      </Chip.Toggle>
      {regelsettSelected && (
        <Chip.Toggle
          selected={type === 'kombinasjon'}
          onClick={() => onChangeFilter(modus, 'kombinasjon')}
          checkmark={false}
        >
          Kombinasjon
        </Chip.Toggle>
      )}
    </Chip.Group>
  </Card>
);

export default TestregelFilter;
