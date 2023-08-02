import useValidate from '@common/form/hooks/useValidate';
import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import TestlabTable from '@common/table/TestlabTable';
import { joinStringsToList } from '@common/util/stringutils';
import {
  Button,
  ButtonColor,
  ErrorMessage,
  FieldSet,
  RadioGroup,
  Select,
  SingleSelectOption,
} from '@digdir/design-system-react';
import {
  LoeysingVerksemd,
  SakContext,
  SakFormBaseProps,
  SakFormState,
} from '@sak/types';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import SakStepFormWrapper from '../../SakStepFormWrapper';
import { getLoeysingVerksemdColumns } from './LoeysingColumns';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
}

const SakLoeysingStep = ({
  formStepState,
  maalingFormState,
  error,
  loading,
  onSubmit,
}: Props) => {
  const { refreshLoeysing, loeysingList, utvalList, verksemdList }: SakContext =
    useOutletContext();

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const { onClickBack } = formStepState;
  const [loeysingId, setLoeysingId] = useState<string | undefined>(undefined);
  const [verksemdId, setVerksemdId] = useState<string | undefined>(undefined);
  const [rowSelection, setRowSelection] = useState<LoeysingVerksemd[]>([]);
  const [source, setSource] = useState<'utval' | 'manuell' | undefined>(
    undefined
  );

  const { control, setValue, getValues, setError, clearErrors, formState } =
    formMethods;

  const selection = useWatch<SakFormState>({
    control,
    name: 'loeysingList',
  }) as LoeysingVerksemd[];

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

          useValidate<LoeysingVerksemd, SakFormState>({
            selection: newLoeysingList,
            name: 'loeysingList',
            setError: setError,
            clearErrors: clearErrors,
            message: 'Løysing og verksemd må veljast',
          });
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

  const listErrors = formState.errors['loeysingList'];

  const onSubmitLoeysing = (data: SakFormState) => {
    if (source === 'manuell' && data.loeysingList.length === 0) {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysing og verksemd må veljast',
      });
    } else {
      onSubmit(data);
    }
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmitLoeysing}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <FieldSet
        legend="Vil du bruke eit ferdig utval?"
        description="Her kan du velje å bruke eit av dei ferdige utvala, eller du kan legge inn løysingane sjølv."
        className="sak-loeysing__utval"
      >
        <RadioGroup
          name="useUtval"
          items={[
            { label: 'Bruk eit utval', value: 'utval' },
            { label: 'Velg løysingar sjølv', value: 'manuell' },
          ]}
          value={source}
          onChange={(value) => {
            return value === 'utval'
              ? setSource('utval')
              : setSource('manuell');
          }}
        />
      </FieldSet>

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
            onChange={(value) =>
              setValue(
                'utval',
                utvalList.find((u) => u.id === Number(value))
              )
            }
            error={listErrors?.message}
          />
        </FieldSet>
      )}
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
            <Button
              title="Legg til"
              color={ButtonColor.Success}
              onClick={onClickAdd}
            >
              Legg til
            </Button>
          </div>
          <div className="sak-loeysing__table">
            <TestlabTable<LoeysingVerksemd>
              data={selection}
              defaultColumns={loeysingColumns}
              displayError={{ error }}
              onClickRetry={refreshLoeysing}
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
            {listErrors && <ErrorMessage>{listErrors?.message}</ErrorMessage>}
          </div>
        </div>
      )}
    </SakStepFormWrapper>
  );
};

export default SakLoeysingStep;
