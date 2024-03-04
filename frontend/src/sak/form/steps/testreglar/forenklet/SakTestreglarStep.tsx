import { TestlabFormLabel } from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import TestlabTable from '@common/table/TestlabTable';
import { ButtonSize, OptionType } from '@common/types';
import { joinStringsToList } from '@common/util/stringutils';
import {
  Button,
  ErrorMessage,
  LegacySelect,
} from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import SakFormWrapper from '@sak/form/SakFormWrapper';
import { sakTestreglarValidationSchemaForenklet } from '@sak/form/steps/testreglar/forenklet/sakTestreglarValidationSchemaForenklet';
import { sakTestreglarValidationSchemaInngaaende } from '@sak/form/steps/testreglar/inngaaende/sakTestreglarValidationSchemaInngaaende';
import { SakContext, SakFormBaseProps, SakFormState } from '@sak/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { TestregelBase } from '@testreglar/api/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
}

const SakTestreglarStep = ({
  onSubmit,
  sakFormState,
  formStepState,
  error,
  loading,
}: Props) => {
  const { testregelList, regelsettList }: SakContext = useOutletContext();
  const isForenkletKontroll = sakFormState?.sakType === 'Forenklet kontroll';

  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(
      isForenkletKontroll
        ? sakTestreglarValidationSchemaForenklet
        : sakTestreglarValidationSchemaInngaaende
    ),
  });

  const regelsettPrefix = 'regelsett';
  const [rowSelection, setRowSelection] = useState<TestregelBase[]>([]);
  const [testregelId, setTestregelId] = useState<string | undefined>(undefined);

  const { control, setValue, getValues, setError, formState, clearErrors } =
    formMethods;

  const selection = useWatch<SakFormState>({
    control,
    name: 'testregelList',
  }) as TestregelBase[];

  const testRegelOptions = useMemo(() => {
    const isForenklet = sakFormState.sakType === 'Forenklet kontroll';

    const filteredRegelsettList = regelsettList.filter((rs) =>
      isForenklet ? rs.modus === 'automatisk' : rs.modus === 'manuell'
    );

    const options: OptionType[] = testregelList
      .filter(
        (tr) =>
          (isForenklet ? tr.modus === 'automatisk' : tr.modus === 'manuell') &&
          !selection.find((s) => s.id === tr.id)
      )
      .map((tr) => ({
        label: tr.namn,
        value: String(tr.id),
      }));

    filteredRegelsettList.forEach((rs) =>
      options.unshift({
        label: `Regelsett '${rs.namn}'`,
        value: `${regelsettPrefix}${String(rs.id)}`,
      })
    );

    return options;
  }, [selection]);

  const handleSelectRow = useCallback((selection: TestregelBase[]) => {
    setRowSelection(selection);
  }, []);

  const testregelColumns = useMemo<ColumnDef<TestregelBase>[]>(
    () => [
      getCheckboxColumn(
        (row: Row<TestregelBase>) => `Velg ${row.original.namn}`,
        true
      ),
      {
        accessorFn: (row) => row.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <>Namn</>,
      },
      {
        accessorFn: (row) => row.krav.tittel,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <>Krav</>,
      },
    ],
    []
  );

  const onClickAdd = () => {
    clearErrors();

    if (testregelId) {
      const selectedTestregelList: TestregelBase[] = [];
      if (testregelId.includes(regelsettPrefix)) {
        const regelsettId = testregelId.replace(regelsettPrefix, '');
        const regelsettTestregelList = regelsettList.find(
          (rs) => rs.id === Number(regelsettId)
        )?.testregelList;

        if (regelsettTestregelList) {
          regelsettTestregelList.forEach((tr) =>
            selectedTestregelList.push(tr)
          );
        }
      } else {
        const selectedTestregel = testregelList.find(
          (tr) => tr.id === Number(testregelId)
        );
        if (selectedTestregel) {
          selectedTestregelList.push(selectedTestregel);
        }
      }

      if (selectedTestregelList && selectedTestregelList.length > 0) {
        const values = getValues('testregelList');
        values.push(...selectedTestregelList);
        const filteredValues = values.filter(
          (value, idx, self) => self.findIndex((v) => v.id === value.id) === idx
        );
        setValue('testregelList', filteredValues);
        setTestregelId(undefined);
      } else {
        setError('testregelList', {
          type: 'manual',
          message: 'Testreglar må veljast',
        });
      }
    } else {
      setError('testregelList', {
        type: 'manual',
        message: 'Testreglar må veljast',
      });
    }
  };

  const onClickRemove = useCallback(() => {
    const oldValues = getValues('testregelList');
    const newValues = oldValues.filter(
      (ov) => !rowSelection.map((rs) => rs.id).includes(ov.id)
    );
    setValue('testregelList', newValues);
  }, [rowSelection, setValue]);

  const formError = getErrorMessage(formState, 'testregelList');

  const getDescription = (): string | undefined => {
    const isForenkletKontroll = sakFormState.sakType === 'Forenklet kontroll';
    if (isForenkletKontroll) {
      return formStepState.currentStep.description;
    } else {
      const verksemdLoeysingRelation = sakFormState?.verksemdLoeysingRelation;
      const verksemdNamn = verksemdLoeysingRelation?.verksemd?.namn;
      const manualVerksemdNamn = verksemdLoeysingRelation?.manualVerksemd?.namn;
      return manualVerksemdNamn || verksemdNamn;
    }
  };

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={getDescription()}
    >
      <div className="sak-testreglar">
        <div className="sak-testreglar__input-wrapper">
          <div className="sak-testreglar__input-select">
            <TestlabFormLabel
              htmlFor="testregelId"
              label="Testregel eller testregelsett"
              required
              description="Vel enkelt testregel eller samling av testreglar (testregelsett)
                du vil legge til."
            />
            <LegacySelect
              inputId="testregelId"
              onChange={setTestregelId}
              options={testRegelOptions}
              value={testregelId}
              error={!!formError}
            />
          </div>
          <Button
            title="Legg til"
            color="success"
            onClick={onClickAdd}
            size={ButtonSize.Small}
          >
            Legg til
          </Button>
        </div>
        <TestlabTable<TestregelBase>
          data={selection}
          defaultColumns={testregelColumns}
          displayError={{ error }}
          loading={loading}
          onSelectRows={handleSelectRow}
          customStyle={{ small: true }}
          actionRequiredError={formError ? ' ' : ''}
          rowActions={[
            {
              action: 'delete',
              rowSelectionRequired: true,
              modalProps: {
                title: 'Fjern testregel',
                disabled: rowSelection.length === 0,
                message: `Vil du fjerne ${joinStringsToList(
                  rowSelection.map((rs) => rs.namn)
                )} frå saka? Dette kan ikkje angrast`,
                onConfirm: onClickRemove,
              },
            },
          ]}
        />
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
      </div>
    </SakFormWrapper>
  );
};

export default SakTestreglarStep;
