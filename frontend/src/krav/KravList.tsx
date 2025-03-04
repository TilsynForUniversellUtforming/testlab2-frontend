import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Checkbox } from '@digdir/designsystemet-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { KRAV_CREATE, KRAV_EDIT } from './KravRoutes';
import { Krav } from './types';
import toError from '@common/error/util';
import { deleteKrav } from './api/krav-api';
import { getCheckboxColumn } from '@common/table/control/toggle/CheckboxColumn';

const KravList = () => {
  const kravliste = useLoaderData() as Krav[];
  const navigate = useNavigate();

  const kravColumns = kravColumnDefs();

  const [kravRowSelection, setKravRowSelection] = useState<Krav[]>([]);
  const [deleteMessage] = useState<string>('');
  const onClickDelete = useCallback(() => {
    function filterKrav(element: Krav, index: number, list: Array<Krav>) {
      return list.includes(element);
    }

    const deleteAndFetchLoeysing = async () => {
      const deleteListe = kravRowSelection.map((krav) => krav.id);
      for (const krav of deleteListe) {
        try {
          await deleteKrav(krav);
        } catch (e) {
          toError(e, 'Feil ved sletting avk krav');
        }
      }

      const updatedKrav = kravliste.filter(filterKrav);
      setKravRowSelection(updatedKrav);
    };

    deleteAndFetchLoeysing().finally(() => {
      setKravRowSelection([]);
    });
  }, [kravRowSelection]);

  return (
    <UserActionTable<Krav>
      heading="Krav"
      subHeading="Liste over alle krav"
      tableProps={{
        data: kravliste,
        defaultColumns: kravColumns,
        rowActions: [
          {
            action: 'add',
            route: KRAV_CREATE,
          },
          {
            action: 'delete',
            rowSelectionRequired: true,
            modalProps: {
              title: 'Slett krav',
              disabled: kravRowSelection.length === 0,
              message: deleteMessage,
              onConfirm: onClickDelete,
            },
          },
        ],
        onClickRow: (row) =>
          navigate(
            getFullPath(KRAV_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default KravList;

const kravColumnDefs = (): Array<ColumnDef<Krav>> => [
  getCheckboxColumn((row: Row<Krav>) => `Velg ${row.original.tittel}`),
  {
    accessorFn: (row) => row.tittel,
    id: 'Tittel',
    cell: ({ getValue }) => getValue(),
    header: () => <>Tittel</>,
  },
  {
    accessorFn: (row) => row.suksesskriterium,
    id: 'suksesskriterium',
    cell: ({ getValue }) => getValue(),
    header: () => <>Suksesskriterium</>,
  },
  {
    accessorFn: (row) => row.gjeldNettsider,
    id: 'gjeldNettsider',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld nettside</>,
  },
  {
    accessorFn: (row) => row.gjeldApp,
    id: 'gjeldApp',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld app</>,
  },
  {
    accessorFn: (row) => row.gjeldAutomat,
    id: 'gjeldAutomat',
    cell: ({ getValue }) => <Checkbox checked={getValue()} readOnly={true} />,
    header: () => <>Gjeld automat</>,
  },
  {
    accessorFn: (row) => row.prinsipp,
    id: 'prinsipp',
    cell: ({ getValue }) => getValue(),
    header: () => <>Prinsipp</>,
  },
  {
    accessorFn: (row) => row.retningslinje,
    id: 'rettninglinje',
    cell: ({ getValue }) => getValue(),
    header: () => <>Rettningslinje</>,
  },

  {
    accessorFn: (row) => row.samsvarsnivaa,
    id: 'samsvarsnivaa',
    cell: ({ getValue }) => getValue(),
    header: () => <>Samsvarsnivaa</>,
  },
  {
    accessorFn: (row) => row.status,
    id: 'status',
    cell: ({ getValue }) => getValue(),
    header: () => <>Status</>,
  },
];
