import { Alert } from '@digdir/designsystemet-react';
import { Regelsett } from '@testreglar/api/types';
import classNames from 'classnames';

import classes from '../kontroll.module.css';
import { ModusFilter } from './types';

interface Props {
  regelsettList: Regelsett[];
  selectedRegelsettId: number | undefined;
  onSelectRegelsett: (regelsettId: number) => void;
  isInngaaende: boolean;
  modus: ModusFilter;
}

const RegelsettSelector = ({
  onSelectRegelsett,
  selectedRegelsettId,
  regelsettList,
  isInngaaende,
  modus,
}: Props) => {
  if ((isInngaaende && modus !== 'manuell') || (!isInngaaende && modus !== 'automatisk')) {
    return (
      <Alert severity="warning">
        Kombinasjon av automatiske og manuelle testreglar er ikkje mogleg ennå
      </Alert>
    );
  }

  if (regelsettList.length === 0) {
    return (
      <Alert severity="info">Ingen regelsett for valgt type tilgjengelig</Alert>
    );
  }

  return (
    <div className={classes.velgRegelsettButtons}>
      {regelsettList.map((regelsett) => (
        <button
          onClick={() => onSelectRegelsett(regelsett.id)}
          className={classNames({
            [classes.selected]: regelsett.id === selectedRegelsettId,
          })}
          key={regelsett.id}
        >
          {regelsett.namn}
        </button>
      ))}
    </div>
  );
};

export default RegelsettSelector;
