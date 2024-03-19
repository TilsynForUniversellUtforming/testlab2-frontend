import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getErrorMessage, normalizeString } from '@common/form/util';
import TestlabTable from '@common/table/TestlabTable';
import { ButtonSize, OptionExtended } from '@common/types';
import { joinStringsToList, removeSpaces } from '@common/util/stringutils';
import {
  Button,
  ErrorMessage,
  NativeSelect,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { getLoeysingVerksemdColumns } from '@sak/form/steps/loeysing/forenklet/LoeysingColumns';
import { LoeysingVerksemd, SakContext, SakFormState } from '@sak/types';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

const SakLoeysingList = () => {
  const { loeysingList, verksemdList }: SakContext = useOutletContext();

  const [rowSelection, setRowSelection] = useState<LoeysingVerksemd[]>([]);
  const [loeysingId, setLoeysingId] = useState<string | undefined>(undefined);
  const [verksemdId, setVerksemdId] = useState<string | undefined>(undefined);
  const [selectableLoeysingList, setSelectableLoeysingList] = useState<
    Loeysing[]
  >([]);

  const { control, formState, setValue, getValues, setError, clearErrors } =
    useFormContext<SakFormState>();

  const selection = useWatch<SakFormState>({
    control,
    name: 'loeysingList',
  }) as LoeysingVerksemd[];

  const loeysingColumns = useMemo(() => getLoeysingVerksemdColumns(), []);

  const onClickAdd = useCallback(() => {
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

        setSelectableLoeysingList([]);
        setLoeysingId(undefined);
        setVerksemdId('blank');
      } else {
        setError('loeysingList', {
          type: 'manual',
          message: 'Løysing og verksemd må veljast',
        });
      }
    } else {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysing og verksemd må veljast',
      });
    }
  }, [loeysingId, verksemdId, loeysingList, verksemdList]);

  const handleChangeLoeysing = useCallback(
    (searchString: string) => {
      clearErrors();
      setLoeysingId(undefined);
      const selection = getValues('loeysingList');

      if (searchString.length === 0) {
        setSelectableLoeysingList([]);
        return;
      }

      const selectionIds = new Set(selection.map((s) => s.loeysing.id));
      const normalizedSearchString = removeSpaces(searchString).toLowerCase();
      const loweredSearchString = searchString.toLowerCase();

      const filteredList = loeysingList.filter((loeysing) => {
        if (selectionIds.has(loeysing.id)) {
          return false;
        }

        return (
          normalizeString(loeysing.namn).includes(normalizedSearchString) ||
          loeysing.url.toLowerCase().includes(loweredSearchString) ||
          loeysing.orgnummer.includes(normalizedSearchString)
        );
      });

      if (filteredList.length === 0) {
        setError('loeysingList', {
          type: 'manual',
          message: `Fann ikkje ${searchString}`,
        });
      }

      setSelectableLoeysingList(filteredList);
    },
    [loeysingList, getValues, setError, clearErrors]
  );

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

  const handleSelectRow = useCallback((selection: LoeysingVerksemd[]) => {
    setRowSelection(selection);
  }, []);

  const verksemdOptions: OptionExtended[] = verksemdList.map((l) => ({
    label: l.namn,
    description: `Orgnr.: ${l.organisasjonsnummer}`,
    value: String(l.id),
  }));

  const listErrors = getErrorMessage(formState, 'loeysingList');

  return (
    <>
      <div className="sak-loeysing__input-wrapper">
        <div className="sak-loeysing__input-select">
          <TestlabFormAutocomplete<SakFormState, Loeysing>
            label="Løysing"
            description="Søk etter namn, orgnr. eller url"
            resultList={selectableLoeysingList}
            resultLabelKey="namn"
            resultDescriptionKey="url"
            onChange={handleChangeLoeysing}
            onClick={(loeysing: Loeysing) => setLoeysingId(String(loeysing.id))}
            retainLabelValueChange={false}
            hideErrors
            name="loeysingList"
            size="small"
          />
        </div>
        <div className="sak-loeysing__input-select">
          <NativeSelect
            label="Ansvarlig verksemd (i saka)"
            onChange={(e) => setVerksemdId(e.currentTarget.value)}
            value={verksemdId}
            error={!!listErrors}
            size="small"
          >
            <option value="blank">Velg …</option>
            {verksemdOptions.map((verksemd) => (
              <option value={verksemd.value} key={verksemd.value}>
                {verksemd.label}
              </option>
            ))}
          </NativeSelect>
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
      {listErrors && <ErrorMessage>{listErrors}</ErrorMessage>}
      <TestlabTable<LoeysingVerksemd>
        data={selection}
        defaultColumns={loeysingColumns}
        onSelectRows={handleSelectRow}
        customStyle={{ small: true }}
        rowActions={[
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Fjern løysing',
              disabled: rowSelection.length === 0,
              message: `Vil du fjerne ${joinStringsToList(
                rowSelection.map((rs) => rs.loeysing.namn)
              )} frå saka? Dette kan ikkje angrast`,
              onConfirm: onClickRemove,
            },
          },
        ]}
      />
    </>
  );
};

export default SakLoeysingList;
