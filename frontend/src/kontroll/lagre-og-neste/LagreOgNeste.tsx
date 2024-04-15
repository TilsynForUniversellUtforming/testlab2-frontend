import { Button, Spinner } from '@digdir/designsystemet-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import React, { useEffect } from 'react';

import classes from './lagre-og-neste.module.css';

type SaveState =
  | { t: 'idle' }
  | { t: 'saving'; timestamp: Date }
  | { t: 'saved' };

function isSaving(
  saveState: SaveState
): saveState is { t: 'saving'; timestamp: Date } {
  return saveState.t === 'saving';
}

type Props = {
  sistLagret: Date | undefined;
  onClickLagreKontroll: () => void;
  onClickNeste: () => void;
};

export default function LagreOgNeste({
  sistLagret,
  onClickLagreKontroll,
  onClickNeste,
}: Props) {
  const [internalSaveState, setInternalSaveState] = React.useState<SaveState>({
    t: 'idle',
  });

  useEffect(() => {
    if (internalSaveState.t === 'saving' && sistLagret) {
      const diff = sistLagret.getTime() - internalSaveState.timestamp.getTime();
      const wait = diff < 1000 ? 1000 - diff : 0;
      setTimeout(() => {
        setInternalSaveState({ t: 'saved' });
      }, wait);
      setTimeout(() => {
        setInternalSaveState({ t: 'idle' });
      }, wait + 3000);
    }
  }, [sistLagret]);

  return (
    <div className={classes.lagreOgNeste}>
      <Button
        variant="secondary"
        onClick={() => {
          setInternalSaveState({ t: 'saving', timestamp: new Date() });
          onClickLagreKontroll();
        }}
        aria-disabled={isSaving(internalSaveState)}
      >
        Lagre kontroll
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          setInternalSaveState({ t: 'saving', timestamp: new Date() });
          onClickNeste();
        }}
        aria-disabled={isSaving(internalSaveState)}
      >
        Neste
      </Button>
      {isSaving(internalSaveState) && (
        <Spinner title={'Lagrer...'} size="small" />
      )}
      {internalSaveState.t === 'saved' && (
        <span className={classes.lagret}>
          Lagret <CheckmarkIcon fontSize="1.5rem" />
        </span>
      )}
    </div>
  );
}
