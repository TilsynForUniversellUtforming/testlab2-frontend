import { Heading, Paragraph, ToggleGroup } from '@digdir/designsystemet-react';
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
      <ToggleGroup onChange={value => onChangeFilter(value as TestregelModus,type)}>
        <ToggleGroup.Item
          value={'manuell'}
          onToggle={() => onChangeFilter('manuell', type)}
          title="Testreglar for inngaående kontroll"
        >
          Manuell
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={'automatisk'}
          onToggle={() => onChangeFilter('automatisk', type)}
          title="Testreglar for forenkla kontroll"
        >
          Automatisk
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={'deque'}
          onToggle={() => onChangeFilter('deque', type)}
          title="Testreglar for Deque Auditor"
        >
          Deque Auditor
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={'semi-automatisk'}
          onToggle={() => onChangeFilter('semi-automatisk', type)}
          title="Testreglar for kombinasjon av inngåaend og forenkla kontroll"
        >
          Begge deler
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
    <div className={classes.testregelFilterVal}>
      <Heading level={5} data-size="xs">
        Kva slags løysing skal du testa?
      </Heading>
      <ToggleGroup onChange={value => onChangeFilter(modus, value as RegelsettInnholdstype)}>
        <ToggleGroup.Item
          value={'nett'}
          onToggle={() => onChangeFilter(modus, 'nett')}
          title="Testreglar for å testa nettløysingar"
        >
          Nett
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={'app'}
          onToggle={() => onChangeFilter(modus, 'app')}
          title="Testreglar for å testa appar"
        >
          App
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={
          'automat'}
          onToggle={() => onChangeFilter(modus, 'automat')}
          title="Testreglar for å testa automatar"
        >
          Automat
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={'dokument'}
          onToggle={() => onChangeFilter(modus, 'dokument')}
          title="Testreglar for å testa dokument"
        >
          Dokument
        </ToggleGroup.Item>
        {regelsettSelected && (
          <ToggleGroup.Item
            value={'kombinasjon'}
            onToggle={() => onChangeFilter(modus, 'kombinasjon')}
            title="Regelsett med testreglar for å testa fleire typar"
          >
            Kombinasjon
          </ToggleGroup.Item>
        )}
      </ToggleGroup>
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
