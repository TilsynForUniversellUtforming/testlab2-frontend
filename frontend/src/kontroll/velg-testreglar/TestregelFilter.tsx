import { Chip, Heading, Paragraph } from '@digdir/designsystemet-react';
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
    <Heading level={3} size="medium" spacing>
      Kva slags test skal du køyra?
    </Heading>
    <div className={classes.testregelFilterVal}>
      <Heading level={5} size="xsmall" spacing>
        Kva slags test skal du køyra?
      </Heading>
      <Chip.Group>
        <Chip.Toggle
          selected={modus === 'manuell'}
          onClick={() => onChangeFilter('manuell', type)}
          title="Testreglar for inngaående kontroll"
        >
          Manuell
        </Chip.Toggle>
        <Chip.Toggle
          selected={modus === 'automatisk'}
          onClick={() => onChangeFilter('automatisk', type)}
          title="Testreglar for forenkla kontroll"
        >
          Automatisk
        </Chip.Toggle>
        <Chip.Toggle
          selected={modus === 'semi-automatisk'}
          onClick={() => onChangeFilter('semi-automatisk', type)}
          title="Testreglar for kombinasjon av inngåaend og forenkla kontroll"
        >
          Begge deler
        </Chip.Toggle>
      </Chip.Group>
    </div>
    <div className={classes.testregelFilterVal}>
      <Heading level={5} size="xsmall" spacing>
        Kva slags løysing skal du testa?
      </Heading>
      <Chip.Group>
        <Chip.Toggle
          selected={type === 'nett'}
          onClick={() => onChangeFilter(modus, 'nett')}
          title="Testreglar for å testa nettløysingar"
        >
          Nett
        </Chip.Toggle>
        <Chip.Toggle
          selected={type === 'app'}
          onClick={() => onChangeFilter(modus, 'app')}
          title="Testreglar for å testa appar"
        >
          App
        </Chip.Toggle>
        <Chip.Toggle
          selected={type === 'automat'}
          onClick={() => onChangeFilter(modus, 'automat')}
          title="Testreglar for å testa automatar"
        >
          Automat
        </Chip.Toggle>
        <Chip.Toggle
          selected={type === 'dokument'}
          onClick={() => onChangeFilter(modus, 'dokument')}
          title="Testreglar for å testa dokument"
        >
          Dokument
        </Chip.Toggle>
        {regelsettSelected && (
          <Chip.Toggle
            selected={type === 'kombinasjon'}
            onClick={() => onChangeFilter(modus, 'kombinasjon')}
            title="Regelsett med testreglar for å testa fleire typar"
          >
            Kombinasjon
          </Chip.Toggle>
        )}
      </Chip.Group>
    </div>
    <div>
      <Heading level={4} size="small" spacing>
        {regelsettSelected ? 'Vel testregelsett' : 'Vel testreglar sjølv'}
      </Heading>
      <Paragraph size="medium" spacing>
        {regelsettSelected
          ? 'Vel et testregelsett frå lista'
          : 'Vel testreglar og suksesskriterium som skal med i testen din'}
      </Paragraph>
    </div>
  </div>
);

export default TestregelFilter;
