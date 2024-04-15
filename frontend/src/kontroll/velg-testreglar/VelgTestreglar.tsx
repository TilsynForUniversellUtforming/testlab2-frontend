import useAlert from '@common/alert/useAlert';
import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isEmpty } from '@common/util/arrayUtils';
import { isNotDefined } from '@common/util/validationUtils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
  Spinner,
} from '@digdir/designsystemet-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import {
  Regelsett,
  TestregelBase,
  TestregelModus,
} from '@testreglar/api/types';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import { UpdateKontrollTestregel } from '../types';
import RegelsettSelector from './RegelsettSelector';
import TestregelFilter from './TestregelFilter';
import TestregelSelector from './TestregelSelector';
import { ModusFilter, SelectionType, VelgTestreglarLoader } from './types';

const filterByModus = <T extends { modus: TestregelModus }>(
  list: T[],
  modus: ModusFilter
): T[] => {
  if (modus !== 'begge') {
    return list.filter((item) => item.modus === modus);
  }
  return list;
};

type SaveState =
  | { t: 'idle' }
  | { t: 'saving'; timestamp: Date }
  | { t: 'saved' };

function isSaving(
  saveState: SaveState
): saveState is { t: 'saving'; timestamp: Date } {
  return saveState.t === 'saving';
}

const VelgTestreglar = () => {
  const { kontroll, testregelList, regelsettList } =
    useLoaderData() as VelgTestreglarLoader;
  const submit = useSubmit();
  const [alert, setAlert] = useAlert();

  /* Regelsett */
  const initRegelsettId = kontroll?.testreglar?.regelsettId;
  const [selectedRegelsettId, setSelectedRegelsettId] = useState<
    number | undefined
  >(initRegelsettId);

  /* Manuelt valgte testregler */
  const initTestregelIdList = initRegelsettId
    ? []
    : kontroll?.testreglar?.testregelList?.map((tr) => tr.id) || [];
  const [selectedTestregelIdList, setSelectedTestregelIdList] =
    useState<number[]>(initTestregelIdList);

  /* Skal sette testregler manuelt eller regelsett */
  const isRegelsett = initRegelsettId || isNotDefined(kontroll?.testreglar);
  const initSelectionType = isRegelsett ? 'regelsett' : 'testregel';
  const [selectionType, setSelectionType] =
    useState<SelectionType>(initSelectionType);

  const [selectAll, setSelectAll] = useState(true);
  const [modus, setModus] = useState<ModusFilter>('manuell');
  const [filteredTestregelList, setFilteredTestregelList] = useState<
    TestregelBase[]
  >(filterByModus(testregelList, modus));
  const [filteredRegelsettList, setFilteredRegelsettList] = useState<
    Regelsett[]
  >(filterByModus(regelsettList, modus));

  const [saveState, setSaveState] = useState<SaveState>({ t: 'idle' });

  const actionData = useActionData() as { sistLagret: Date };

  useEffect(() => {
    if (actionData?.sistLagret && isSaving(saveState)) {
      const now = new Date();
      const diff = now.getTime() - saveState.timestamp.getTime();
      const wait = diff < 1000 ? 1000 - diff : 0;
      setTimeout(() => {
        setSaveState({ t: 'saved' });
      }, wait);
      setTimeout(() => {
        setSaveState({ t: 'idle' });
      }, wait + 3000);
    }
  }, [actionData]);

  const toggleSelectAll = () => {
    setSelectAll((selectAll) => !selectAll);
  };

  const onSelectRegelsett = (regelsettId: number) => {
    const selectedRegelsett = regelsettList.find((rs) => rs.id === regelsettId);
    if (!selectedRegelsett) {
      throw new Error('Valgt regelsett finns ikkje');
    }

    setSelectedRegelsettId((prev) => {
      if (prev === regelsettId) {
        return undefined;
      } else {
        return regelsettId;
      }
    });
    setSelectedTestregelIdList([]);
  };

  const onChangeModus = useCallback(
    (modus: ModusFilter) => {
      setModus(modus);

      setFilteredTestregelList(filterByModus(testregelList, modus));
      setFilteredRegelsettList(filterByModus(regelsettList, modus));

      setSelectedRegelsettId(undefined);
      setSelectedTestregelIdList([]);
    },
    [selectionType]
  );

  const onSelectTestregelId = (selectedIds: string[]) => {
    const selectedIdsNumeric = selectedIds.map((id) => Number(id));
    const testregelIds = testregelList.map((tr) => tr.id);
    const validTestregelIds = selectedIdsNumeric.every(
      (id) => !isNaN(id) && testregelIds.includes(id)
    );
    if (!validTestregelIds) {
      throw new Error('Valgt testregel finns ikkje');
    }

    setSelectedTestregelIdList(selectedIdsNumeric);
    setSelectedRegelsettId(undefined);
  };

  const regelsettSelected = selectionType === 'regelsett';

  const lagreKontroll = () => {
    const testregelIdList: number[] = [];
    alert?.clearMessage();
    setSaveState({ t: 'saving', timestamp: new Date() });

    if (regelsettSelected && selectedRegelsettId) {
      const testregelIdsForRegelsett = regelsettList
        .find((rs) => rs.id === selectedRegelsettId)
        ?.testregelList.map((tr) => tr.id);

      if (isNotDefined(testregelIdsForRegelsett)) {
        setAlert('danger', 'Kan ikkje lagre, regelsett finns ikkje');
      } else {
        testregelIdList.push(...testregelIdsForRegelsett);
      }
    } else {
      if (isEmpty(selectedTestregelIdList)) {
        setAlert('danger', 'Kan ikkje lagre uten testreglar');
      } else {
        testregelIdList.push(...selectedTestregelIdList);
      }
    }

    const data: UpdateKontrollTestregel = {
      kontroll,
      testreglar: {
        regelsettId: selectedRegelsettId,
        testregelIdList: testregelIdList,
      },
    };
    submit(JSON.stringify(data), {
      method: 'put',
      action: `/kontroll/${kontroll.id}/velg-testreglar`,
      encType: 'application/json',
    });
  };

  return (
    <section className={classes.byggKontroll}>
      <nav className={classes.stepper}>
        <ol>
          <li>Opprett kontroll</li>
          <li>Velg løsninger</li>
          <li>Gjennomfør sideutvalg</li>
          <li className={classes.selected}>Testregler</li>
          <li>Oppsummering</li>
        </ol>
      </nav>
      <div className={classes.velgTestreglarOverskrift}>
        <Heading level={1} size="xlarge">
          Vel testreglar
        </Heading>
        <Paragraph>
          Vel hvilke testreglar du vil ha med inn i kontrollen
        </Paragraph>
      </div>
      <div className={classes.testregelEllerManuelt}>
        <button
          onClick={() => setSelectionType('regelsett')}
          className={classNames({
            [classes.selected]: regelsettSelected,
          })}
        >
          Vel testregelsett
        </button>
        <button
          onClick={() => setSelectionType('testregel')}
          className={classNames({
            [classes.selected]: !regelsettSelected,
          })}
        >
          Vel testreglar selv
        </button>
      </div>
      <div className={classes.testreglarValgWrapper}>
        <TestregelFilter
          heading={
            regelsettSelected ? 'Vel testregelsett' : 'Vel testreglar selv'
          }
          switchTitle={
            regelsettSelected
              ? 'Vel same regelsett til alle løysingar'
              : 'Vel same testreglar til alle løysingar'
          }
          selectAll={selectAll}
          onToggleSelectAll={toggleSelectAll}
          modus={modus}
          onChangeModus={onChangeModus}
        />
        <div className={classes.testreglarValg}>
          <ConditionalComponentContainer
            condition={regelsettSelected}
            conditionalComponent={
              <RegelsettSelector
                regelsettList={filteredRegelsettList}
                onSelectRegelsett={onSelectRegelsett}
                modus={modus}
                selectedRegelsettId={selectedRegelsettId}
              />
            }
            otherComponent={
              <TestregelSelector
                testregelList={filteredTestregelList}
                modus={modus}
                selectedTestregelIdList={selectedTestregelIdList}
                onSelectTestregelId={onSelectTestregelId}
              />
            }
          />
        </div>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <div className={classes.lagreOgNeste}>
          <Button
            variant="secondary"
            onClick={lagreKontroll}
            aria-disabled={isSaving(saveState)}
          >
            Lagre kontroll
          </Button>
          <Button
            variant="primary"
            onClick={lagreKontroll}
            aria-disabled={isSaving(saveState)}
          >
            Neste
          </Button>
          {isSaving(saveState) && <Spinner title={'Lagrer...'} size="small" />}
          {saveState.t === 'saved' && (
            <span className={classes.lagret}>
              Lagret <CheckmarkIcon fontSize="1.5rem" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default VelgTestreglar;
