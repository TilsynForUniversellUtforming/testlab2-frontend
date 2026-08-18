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
  submitOnSave?: boolean;
  feilet?: boolean;
};

export default function LagreOgNeste({
  sistLagret,
  onClickLagreKontroll,
  onClickNeste,
  submitOnSave = false,
  feilet = false,
}: Readonly<Props>) {
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

  useEffect(() => {
    if (feilet) {
      setInternalSaveState({ t: 'idle' });
    }
  }, [feilet]);

  const startSaving = () => {
    setInternalSaveState({ t: 'saving', timestamp: new Date() });
  };

  const handleSave = () => {
    if (!feilet) {
      onClickLagreKontroll();
      if (submitOnSave) {
        // Let native submit execute before disabling the submit button.
        globalThis.setTimeout(startSaving, 0);
      } else {
        startSaving();
      }
    }
  };

  const handleSaveNeste = () => {
    if (!feilet) {
      onClickNeste();
      if (submitOnSave) {
        // Let native submit execute before disabling the submit button.
        globalThis.setTimeout(startSaving, 0);
      } else {
        startSaving();
      }
    }
  };

  return (
    <div className={classes.lagreOgNeste}>
      <Button
        variant="secondary"
        onClick={handleSave}
        type={submitOnSave ? 'submit' : 'button'}
        aria-disabled={isSaving(internalSaveState)}
        disabled={isSaving(internalSaveState)}
      >
        Lagre til seinare
      </Button>
      <Button
        variant="primary"
        onClick={handleSaveNeste}
        aria-disabled={isSaving(internalSaveState)}
        disabled={isSaving(internalSaveState)}
        type={submitOnSave ? 'submit' : 'button'}
      >
        Lagre og gå til neste
      </Button>
      {isSaving(internalSaveState) && (
        <Spinner aria-label={'Lagrer...'} data-size="sm" />
      )}
      {internalSaveState.t === 'saved' && (
        <span className={classes.lagret}>
          Lagret <CheckmarkIcon fontSize="1.5rem" />
        </span>
      )}
    </div>
  );
}
