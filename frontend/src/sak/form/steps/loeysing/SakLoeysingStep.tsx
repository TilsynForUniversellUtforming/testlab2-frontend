import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import { getErrorMessage } from '@common/form/util';
import TestlabTable from '@common/table/TestlabTable';
import { joinStringsToList } from '@common/util/stringutils';
import {
  Button,
  ErrorMessage,
  FieldSet,
  RadioGroup,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { sakLoeysingValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import {
  LoeysingSource,
  LoeysingVerksemd,
  SakFormBaseProps,
  SakFormState,
} from '@sak/types';
import { Verksemd } from '@verksemder/api/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SakStepFormWrapper from '../../SakStepFormWrapper';
import { getLoeysingVerksemdColumns } from './LoeysingColumns';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  loeysingList: Loeysing[];
  utvalList: Utval[];
  verksemdList: Verksemd[];
}

const SakLoeysingStep = ({
  formStepState,
  maalingFormState,
  loeysingList,
  utvalList,
  verksemdList,
  error,
  loading,
  onSubmit,
}: Props) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
    resolver: zodResolver(sakLoeysingValidationSchema),
  });

  const { control, setValue, getValues, setError, clearErrors, formState } =
    formMethods;

  const { onClickBack } = formStepState;
  const [loeysingId, setLoeysingId] = useState<string | undefined>(undefined);
  const [verksemdId, setVerksemdId] = useState<string | undefined>(undefined);
  const [rowSelection, setRowSelection] = useState<LoeysingVerksemd[]>([]);
  const [source, selection] = useWatch<SakFormState>({
    control,
    name: ['loeysingSource', 'loeysingList'],
  }) as [LoeysingSource, LoeysingVerksemd[]];

  const loeysingOptions: SingleSelectOption[] = useMemo(() => {
    const filteredLoeysingList = loeysingList.filter(
      (ll) => !selection.find((s) => s.loeysing.id === ll.id)
    );

    return filteredLoeysingList.map((l) => ({
      label: l.namn,
      formattedLabel: (
        <>
          <b>{l.namn}</b>
          <div>{l.url}</div>
        </>
      ),
      value: String(l.id),
    }));
  }, [selection]);

  const verksemdOptions: SingleSelectOption[] = verksemdList.map((l) => ({
    label: l.namn,
    formattedLabel: (
      <>
        <b>{l.namn}</b>
        <div>Organisasjonsnummer: {l.organisasjonsnummer}</div>
      </>
    ),
    value: String(l.id),
  }));

  const handleSelectRow = useCallback((selection: LoeysingVerksemd[]) => {
    setRowSelection(selection);
  }, []);

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  const loeysingColumns = useMemo(() => getLoeysingVerksemdColumns(), []);

  const onClickAdd = () => {
    if (loeysingId && verksemdId) {
      const loeysing = loeysingList.find((l) => l.id === Number(loeysingId));
      const verksemd = verksemdList.find((l) => l.id === Number(verksemdId));
      if (loeysing && verksemd) {
        const oldValues = getValues('loeysingList');
        const newLoeysingList = [
          ...oldValues,
          { loeysing: loeysing, verksemd: verksemd },
        ];
        const filteredValues = newLoeysingList.filter(
          (value, idx, self) =>
            self.findIndex((v) => v.loeysing.id === value.loeysing.id) === idx
        );
        if (filteredValues.length !== newLoeysingList.length) {
          setError('loeysingList', {
            type: 'manual',
            message: 'Løysingar må vera unike',
          });
        } else {
          setValue('loeysingList', filteredValues);
          clearErrors();
        }

        setLoeysingId(undefined);
        setVerksemdId(undefined);
      } else {
        setError('loeysingList', {
          type: 'manual',
          message: 'Løysing og verksemd må veljast',
        });
      }
    }
  };

  const onClickRemove = useCallback(() => {
    const oldValues = getValues('loeysingList');
    const newLoeysingList = oldValues.filter(
      (ov) =>
        !rowSelection
          .map((rs) => `${rs.loeysing.id}_${rs.verksemd.id}`)
          .includes(`${ov.loeysing.id}_${ov.verksemd.id}`)
    );
    setValue('loeysingList', newLoeysingList);
    setRowSelection([]);
  }, [rowSelection, setValue]);

  const listErrors = getErrorMessage(formState, 'loeysingList');

  const handleChangeSource = (source?: string) => {
    if (typeof source === 'undefined') {
      throw new Error('Ugyldig kilde');
    }

    clearErrors();
    setValue('loeysingSource', source as LoeysingSource);
    setValue('utval', undefined);
    setValue('loeysingList', []);
  };

  const handleChangeUtval = (value?: string) => {
    const utval = utvalList.find((u) => u.id === Number(value));
    setValue('utval', utval);
    clearErrors();
  };

  const onSubmitLoeysing = useCallback((data: SakFormState) => {
    if (source === 'manuell' && data.loeysingList.length === 0) {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysing og verksemd må veljast',
      });
    } else {
      onSubmit(data);
    }
  }, []);

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmitLoeysing}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-loeysing__utval">
        <RadioGroup
          legend="Vil du bruke eit ferdig utval?"
          description="Her kan du velje å bruke eit av dei ferdige utvala, eller du kan legge inn løysingane sjølv."
          name="useUtval"
          items={[
            { label: 'Bruk eit utval', value: 'utval' },
            { label: 'Velg løysingar sjølv', value: 'manuell' },
          ]}
          value={source}
          onChange={handleChangeSource}
        />

        {source === 'utval' && (
          <FieldSet legend="Velg eit utval">
            {utvalList.length === 0 && (
              <p>
                <em>
                  Det finnes inga lagra utval. Du må enten leggje til løysingar
                  sjølv, eller lage eit utval før du oppretter ei ny måling.
                </em>
              </p>
            )}
            <RadioGroup
              name="chooseUtval"
              value={String(getValues('utval')?.id)}
              items={utvalList.map((u) => ({
                label: u.namn,
                value: String(u.id),
              }))}
              onChange={handleChangeUtval}
              error={listErrors && <>{listErrors}</>}
            />
          </FieldSet>
        )}
      </div>
      {source === 'manuell' && (
        <div className="sak-loeysing">
          <div className="sak-loeysing__input-wrapper">
            <div className="sak-loeysing__input-select">
              <Select
                options={loeysingOptions}
                label="Løysing"
                onChange={setLoeysingId}
                value={loeysingId}
              />
            </div>
            <div className="sak-loeysing__input-select">
              <Select
                options={verksemdOptions}
                label="Ansvarlig verksemd (i saka)"
                onChange={setVerksemdId}
                value={verksemdId}
              />
            </div>
            <Button title="Legg til" color="success" onClick={onClickAdd}>
              Legg til
            </Button>
          </div>
          <div className="sak-loeysing__table">
            <TestlabTable<LoeysingVerksemd>
              data={selection}
              defaultColumns={loeysingColumns}
              displayError={{ error }}
              loading={loading}
              onSelectRows={handleSelectRow}
              customStyle={{ small: true }}
              rowActions={[
                {
                  action: 'delete',
                  modalProps: {
                    title: 'Fjern rad',
                    disabled: rowSelection.length === 0,
                    message: `Fjern ${joinStringsToList(
                      rowSelection.map((rs) => rs.loeysing.namn)
                    )}?`,
                    onConfirm: onClickRemove,
                  },
                },
              ]}
            />
            {listErrors && <ErrorMessage>{listErrors}</ErrorMessage>}
          </div>
        </div>
      )}
    </SakStepFormWrapper>
  );
};

export default SakLoeysingStep;
