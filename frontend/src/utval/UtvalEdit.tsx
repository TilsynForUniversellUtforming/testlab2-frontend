import { Utval } from '@utval/types';
import { useLoaderData } from 'react-router';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Loeysing } from '@loeysingar/api/types';
import { useCallback, useMemo, useState } from 'react';
import UserActionTable from '@common/table/UserActionTable';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';
import { updateUtval } from '@utval/utval-api';
import toError from '@common/error/util';
import { joinStringsToList } from '@common/util/stringutils';
import { Button } from '@digdir/designsystemet-react';

export const UtvalEdit = () => {
  const utval = useLoaderData() as Utval;
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>(utval.loeysingar);
  const [loeysingRowSelection, setLoeysingRowSelection] = useState<Loeysing[]>(
    []
  );
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [infoMessage, setInfoMessage] = useState<string>('');

  const onChangeLoeysingField = useCallback(
    (id: number, field: 'namn' | 'url' | 'orgnummer', value: string) => {
      setLoeysingList((prev) =>
        prev.map((loeysing) =>
          loeysing.id === id ? { ...loeysing, [field]: value } : loeysing
        )
      );
    },
    []
  );

  const onSelectRows = useCallback((rowSelection: Loeysing[]) => {
    setLoeysingRowSelection(rowSelection);

    if (rowSelection.length === 0) {
      setDeleteMessage('');
    } else {
      setDeleteMessage(
        `Vil du sletta ${joinStringsToList(
          rowSelection.map((r) => r.namn)
        )}? Dette kan ikkje angrast`
      );
    }
  }, []);

  const onClickDelete = useCallback(() => {
    setError(undefined);
    setInfoMessage('');

    if (loeysingRowSelection.length === 0) {
      setError(new Error('Kunne ikkje slette løysing, ingen løysing valgt'));
      return;
    }

    const loeysingIdList = loeysingRowSelection.map((l) => l.id);
    setLoeysingList((prevList) =>
      prevList.filter((l) => !loeysingIdList.includes(l.id))
    );
    setLoeysingRowSelection([]);
  }, []);

  const onClickAdd = useCallback(() => {
    setError(undefined);
    setInfoMessage('');

    const newLoeysing: Loeysing = {
      id: -Date.now(),
      namn: '',
      url: '',
      orgnummer: '',
      type: 'nett',
      verksemdnamn: '',
    };

    setLoeysingList((prevList) => [newLoeysing, ...prevList]);
  }, [loeysingRowSelection]);

  const onClickSave = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    setInfoMessage('');

    try {
      const updated = await updateUtval({ ...utval, loeysingar: loeysingList });
      setLoeysingList(updated.loeysingar);
      setInfoMessage('Endringane blei lagra.');
    } catch (e) {
      setError(toError(e, 'Kunne ikkje oppdatere utval'));
    } finally {
      setLoading(false);
    }
  }, [loeysingList, utval]);

  const hasInvalidRows = loeysingList.some(
    (row) =>
      row.namn.trim().length === 0 ||
      row.url.trim().length === 0 ||
      row.orgnummer.trim().length === 0
  );

  const loeysingColumns = useMemo<ColumnDef<Loeysing>[]>(
    () => getUtvalLoeysingColumns(onChangeLoeysingField),
    [onChangeLoeysingField]
  );


  return (
    <div>
      <h1>Rediger Utval</h1>
      <p>Her kan du redigere utval: {utval.namn}</p>
      <UserActionTable<Loeysing>
        heading={'Utval'}
        subHeading={'Loeysingar i utval: ' + loeysingList.length}
        children={
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Button data-size="sm" onClick={onClickAdd} disabled={loading}>
              Legg til løysing
            </Button>
            <Button
              data-size="sm"
              onClick={onClickSave}
              disabled={loading || hasInvalidRows}
            >
              Lagre utval
            </Button>
            {hasInvalidRows && (
              <p style={{ margin: 0 }}>
                Fyll ut namn, URL og organisasjonsnummer for alle rader før lagring.
              </p>
            )}
            {infoMessage && <p style={{ margin: 0 }}>{infoMessage}</p>}
          </div>
        }
        tableProps={{
          data: loeysingList,
          defaultColumns: loeysingColumns,
          loading: loading,
          displayError: {
            errorHeader: 'Noko gjekk gale med oppdatering av utval',
            error: error,
            buttonText: 'Lukk',
            onClick: () => setError(undefined),
          },
          onSelectRows: onSelectRows,
          rowActions: [
            {
              action: 'delete',
              rowSelectionRequired: true,
              modalProps: {
                title: 'Slett løysingar',
                disabled: loeysingRowSelection.length === 0,
                message: deleteMessage,
                onConfirm: onClickDelete,
              },
            },
          ],
        }}
      />
    </div>
  );
};

function getUtvalLoeysingColumns(
  onChange: (id: number, field: 'namn' | 'url' | 'orgnummer', value: string) => void
): ColumnDef<Loeysing>[] {
  return [
    getCheckboxColumn((row: Row<Loeysing>) => `Velg ${row.original.namn}`),
    {
      accessorFn: (row) => row.namn,
      id: 'namn',
      cell: ({ row }) => (
        <input
          value={row.original.namn}
          onChange={(e) => onChange(row.original.id, 'namn', e.target.value)}
          aria-label={`Namn for ${row.original.namn || 'ny løysing'}`}
        />
      ),
      header: () => <>Namn</>,
    },
    {
      accessorFn: (row) => row.url,
      id: 'url',
      cell: ({ row }) => (
        <input
          value={row.original.url}
          onChange={(e) => onChange(row.original.id, 'url', e.target.value)}
          aria-label={`URL for ${row.original.namn || 'ny løysing'}`}
        />
      ),
      header: () => <>URL</>,
    },
    {
      accessorFn: (row) => row.orgnummer,
      id: 'organisasjonsnummer',
      cell: ({ row }) => (
        <input
          value={row.original.orgnummer}
          onChange={(e) => onChange(row.original.id, 'orgnummer', e.target.value)}
          aria-label={`Organisasjonsnummer for ${row.original.namn || 'ny løysing'}`}
        />
      ),
      header: () => <>Organisasjonsnummer</>,
    },
    {
      accessorFn: (row) => row.verksemdnamn,
      id: 'verksemd',
      cell: (info) => info.getValue() || 'Ingen verksemd',
      header: () => <>Verksemd</>,
    },
  ];
}