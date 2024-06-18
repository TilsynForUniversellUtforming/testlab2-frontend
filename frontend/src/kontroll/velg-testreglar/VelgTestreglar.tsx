import useAlert from '@common/alert/useAlert';
import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isEmpty } from '@common/util/arrayUtils';
import { isNotDefined } from '@common/util/validationUtils';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import {
  Regelsett,
  RegelsettInnholdstype,
  TestregelBase,
  TestregelModus,
} from '@testreglar/api/types';
import { filterList } from '@testreglar/api/util';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useActionData, useLoaderData, useSubmit } from 'react-router-dom';

import classes from '../kontroll.module.css';
import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';
import KontrollStepper from '../stepper/KontrollStepper';
import { UpdateKontrollTestregel } from '../types';
import RegelsettSelector from './RegelsettSelector';
import TestregelFilter from './TestregelFilter';
import TestregelSelector from './TestregelSelector';
import { SelectionType, VelgTestreglarLoader } from './types';

const VelgTestreglar = () => {
  const { kontroll, testregelList, regelsettList, testStatus } =
    useLoaderData() as VelgTestreglarLoader;
  const submit = useSubmit();
  const actionData = useActionData() as { sistLagret: Date };
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

  /* Oppsett av type test man skal kjøre */
  const isInngaaende = kontroll.kontrolltype === 'inngaaende-kontroll';
  const [modus, setModus] = useState<TestregelModus>(
    isInngaaende ? 'manuell' : 'automatisk'
  );

  const initType =
    (isRegelsett
      ? regelsettList.find((r) => r.id === kontroll.testreglar?.regelsettId)
          ?.type
      : kontroll.testreglar?.testregelList[0]?.type) ?? 'nett';

  const [type, setType] = useState<RegelsettInnholdstype>(initType);
  const [filteredTestregelList, setFilteredTestregelList] = useState<
    TestregelBase[]
  >(filterList(testregelList, modus, type));
  const [filteredRegelsettList, setFilteredRegelsettList] = useState<
    Regelsett[]
  >(filterList(regelsettList, modus, type));

  const handleSetSelectionType = (selectionType: SelectionType) => {
    setSelectedRegelsettId(undefined);
    setSelectedTestregelIdList([]);

    /* Type 'kombinasjon' finnes kun for regelsett, sett til default 'nett'
             ved endring til å velge testregler manuelt */
    if (selectionType === 'testregel' && type === 'kombinasjon') {
      setType('nett');
      setFilteredTestregelList(filterList(testregelList, modus, 'nett'));
      setFilteredRegelsettList(filterList(regelsettList, modus, 'nett'));
    }

    setSelectionType(selectionType);
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

  const onChangeFilter = useCallback(
    (selectedModus: TestregelModus, selectedType: RegelsettInnholdstype) => {
      setModus(selectedModus);
      setType(selectedType);

      setFilteredTestregelList(
        filterList(testregelList, selectedModus, selectedType)
      );
      setFilteredRegelsettList(
        filterList(regelsettList, selectedModus, selectedType)
      );

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

  const lagreKontroll = (neste: boolean) => () => {
    const testregelIdList: number[] = [];
    alert?.clearMessage();

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
      neste,
    };
    submit(JSON.stringify(data), {
      method: 'put',
      action: `/kontroll/${kontroll.id}/velg-testreglar`,
      encType: 'application/json',
    });
  };

  return (
    <section className={classes.kontrollSection}>
      <KontrollStepper />
      <div className={classes.velgTestreglarOverskrift}>
        <Heading level={1} size="xlarge" data-testid="testreglar-heading">
          Vel testreglar
        </Heading>
        <Paragraph>
          Vel hvilke testreglar du vil ha med inn i kontrollen
        </Paragraph>
      </div>
      <div className={classes.testregelEllerManuelt}>
        <button
          onClick={() => handleSetSelectionType('regelsett')}
          className={classNames({
            [classes.selected]: regelsettSelected,
          })}
        >
          Vel testregelsett
        </button>
        <button
          onClick={() => handleSetSelectionType('testregel')}
          className={classNames({
            [classes.selected]: !regelsettSelected,
          })}
        >
          Vel testreglar sjølv
        </button>
      </div>
      <div className={classes.testregelSelection}>
        <TestregelFilter
          regelsettSelected={regelsettSelected}
          modus={modus}
          type={type}
          onChangeFilter={onChangeFilter}
        />
        <div className={classes.testreglarValgWrapper}>
          <div className={classes.testreglarValg}>
            <ConditionalComponentContainer
              condition={regelsettSelected}
              conditionalComponent={
                <RegelsettSelector
                  regelsettList={filteredRegelsettList}
                  onSelectRegelsett={onSelectRegelsett}
                  modus={modus}
                  isInngaaende={isInngaaende}
                  selectedRegelsettId={selectedRegelsettId}
                />
              }
              otherComponent={
                <TestregelSelector
                  testregelList={filteredTestregelList}
                  modus={modus}
                  selectedTestregelIdList={selectedTestregelIdList}
                  onSelectTestregelId={onSelectTestregelId}
                  isInngaaende={isInngaaende}
                />
              }
            />
          </div>
          {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
          <LagreOgNeste
            testStarta={testStatus === 'Started'}
            sistLagret={actionData?.sistLagret}
            onClickLagreKontroll={lagreKontroll(false)}
            onClickNeste={lagreKontroll(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default VelgTestreglar;
