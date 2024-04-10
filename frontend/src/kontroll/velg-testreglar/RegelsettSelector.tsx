import { Alert } from '@digdir/designsystemet-react';
import { Regelsett } from '@testreglar/api/types';
import classNames from 'classnames';

import classes from '../kontroll.module.css';

interface Props {
  regelsettList: Regelsett[];
  selectedRegelsettId: number | undefined;
  onSelectRegelsett: (regelsettId: number) => void;
}

const RegelsettSelector = ({
  onSelectRegelsett,
  selectedRegelsettId,
  regelsettList,
}: Props) => {
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
