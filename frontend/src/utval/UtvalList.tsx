import { useLoaderData, useNavigate } from 'react-router';
import { Utval } from '@utval/types';
import { useCallback, useMemo, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { UTVAL_EDIT } from '@utval/UtvalRoutes';
import toError from '@common/error/util';
import { joinStringsToList } from '@common/util/stringutils';
import { deleteUtval } from '@utval/utval-api';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';

export const UtvalList = () => {
  const navigate = useNavigate();

  const [utvalList,setUtvalList] = useState(useLoaderData() as Utval[]);


  const utvalColumns = useMemo<ColumnDef<Utval>[]>(() => getUtvalColumns(), []);



  const [utvalRowSelection, setUtvalRowSelection] = useState<Utval[]>(
    []
  );
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);




  const onClickDelete = useCallback(() => {
    setLoading(true);

    if (utvalRowSelection.length === 0) {
      throw new Error('Kunne ikkje slette utval, ingen løysing valgt');
    }

    const deleteAndFetchUtval = async () => {
      try {
        const utvalIdList = utvalRowSelection.map((u) => u.id);
        for (const utvalId of utvalIdList) {
          const data = await deleteUtval(utvalId);
          console.log('Slettet utval med id:', utvalId, 'Data:', data);
          setUtvalList((prevList => prevList.filter(u => u.id !== utvalId)))
        }
      } catch (e) {
        toError(e, 'Kunne ikkje slette utval');
      }
    };

    deleteAndFetchUtval().finally(() => {
      setLoading(false);
      setUtvalRowSelection([]);
    });
  }, [utvalRowSelection]);

  const onSelectRows = useCallback((rowSelection: Utval[]) => {
    setUtvalRowSelection(rowSelection);

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




  return (
    <UserActionTable<Utval>
      heading={'Utval'}
      tableProps={{
        data: utvalList,
        defaultColumns: utvalColumns,
        onClickRow: (row) =>
          navigate(
            getFullPath(UTVAL_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
        onSelectRows: onSelectRows,
        rowActions: [
          {
            action:'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett utval',
              disabled: utvalRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          }
        ]
      }}
    />
  );
}

function getUtvalColumns(): ColumnDef<Utval>[] {
  return [
    getCheckboxColumn((row: Row<Utval>) => `Velg ${row.original.namn}`),
    {
      accessorFn: (row) => row.namn,
      id: 'utval namn',
      cell: ({ getValue }) => getValue(),
      header: () => <>Namn</>,
    },
  ];
}