import {
  Chip,
  Heading,
  Paragraph,
  ToggleGroup,
} from '@digdir/designsystemet-react';
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
  <div className={classes.testregelFilter}>
    <Heading level={3} data-size="md">
      Kva slags test skal du køyra?
    </Heading>
    <div className={classes.testregelFilterVal}>
      <Heading level={5} data-size="xs">
        Kva slags test skal du køyra?
      </Heading>

      <Chip.Radio
        value={'manuell'}
        onChange={() => onChangeFilter('manuell', type)}
        title="Testreglar for inngaående kontroll"
        checked={modus === 'manuell'}
        className={classes.testregelFilterValChipRadio}
      >
        Manuell
      </Chip.Radio>
      <Chip.Radio
        value={'automatisk'}
        onChange={() => onChangeFilter('automatisk', type)}
        title="Testreglar for forenkla kontroll"
        checked={modus === 'automatisk'}
        className={classes.testregelFilterValChipRadio}
      >
        Automatisk
      </Chip.Radio>
      <Chip.Radio
        value={'deque'}
        onChange={() => onChangeFilter('deque', type)}
        title="Testreglar for Deque Auditor"
        checked={modus === 'deque'}
        className={classes.testregelFilterValChipRadio}
      >
        Deque Auditor
      </Chip.Radio>
      <Chip.Radio
        value={'semi-automatisk'}
        onChange={() => onChangeFilter('semi-automatisk', type)}
        title="Testreglar for kombinasjon av inngåaend og forenkla kontroll"
        checked={modus === 'semi-automatisk'}
        className={classes.testregelFilterValChipRadio}
      >
        Begge deler
      </Chip.Radio>
    </div>
    <div className={classes.testregelFilterVal}>
      <Heading level={5} data-size="xs">
        Kva slags løysing skal du testa?
      </Heading>
      <Chip.Radio
        value={'nett'}
        onChange={() => onChangeFilter(modus, 'nett')}
        title="Testreglar for å testa nettløysingar"
        checked={type === 'nett'}
        className={classes.testregelFilterValChipRadio}
      >
        Nett
      </Chip.Radio>
      <Chip.Radio
        value={'app'}
        onChange={() => onChangeFilter(modus, 'app')}
        title="Testreglar for å testa appar"
        checked={type === 'app'}
        className={classes.testregelFilterValChipRadio}
      >
        App
      </Chip.Radio>
      <Chip.Radio
        value={'automat'}
        onChange={() => onChangeFilter(modus, 'automat')}
        title="Testreglar for å testa automatar"
        checked={type === 'automat'}
        className={classes.testregelFilterValChipRadio}
      >
        Automat
      </Chip.Radio>
      <Chip.Radio
        value={'dokument'}
        onChange={() => onChangeFilter(modus, 'dokument')}
        title="Testreglar for å testa dokument"
        checked={type === 'dokument'}
        className={classes.testregelFilterValChipRadio}
      >
        Dokument
      </Chip.Radio>
      {regelsettSelected && (
        <Chip.Radio
          value={'kombinasjon'}
          onChange={() => onChangeFilter(modus, 'kombinasjon')}
          title="Regelsett med testreglar for å testa fleire typar"
        >
          Kombinasjon
        </Chip.Radio>
      )}
    </div>
    <div>
      <Heading level={4} data-size="sm">
        {regelsettSelected ? 'Vel testregelsett' : 'Vel testreglar sjølv'}
      </Heading>
      <Paragraph data-size="md">
        {regelsettSelected
          ? 'Vel et testregelsett frå lista'
          : 'Vel testreglar og suksesskriterium som skal med i testen din'}
      </Paragraph>
    </div>
  </div>
);

export default TestregelFilter;
