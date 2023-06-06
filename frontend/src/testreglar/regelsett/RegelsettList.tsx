import { List, ListItem } from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import UserActionTable from '../../common/table/UserActionTable';
import { TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

const RegelsettList = () => {
  const { contextError, contextLoading, regelsett, refresh }: TestregelContext =
    useOutletContext();

  const [error, setError] = useState<Error | undefined>(contextError);
  const [loading, setLoading] = useState<boolean>(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const regelsettColumns: ColumnDef<TestRegelsett>[] = [
    {
      accessorFn: (row) => row.namn,
      id: 'Navn',
      cell: (info) => info.getValue(),
      header: () => <>Navn</>,
    },
    {
      accessorFn: (row) =>
        row.testregelList
          .map((tr) => `${tr.referanseAct} - ${tr.kravTilSamsvar}`)
          .join(','),
      id: 'TestregelId',
      cell: ({ row }) => (
        <List className="testreglar-regelsett__list">
          {row.original.testregelList.map((tr) => (
            <ListItem
              key={tr.id}
              className="testreglar-regelsett__list-item"
            >{`${tr.referanseAct} - ${tr.kravTilSamsvar}`}</ListItem>
          ))}
        </List>
      ),
      header: () => <>Testregler</>,
    },
  ];

  return (
    <UserActionTable<TestRegelsett>
      heading="Regelsett"
      tableProps={{
        data: regelsett,
        defaultColumns: regelsettColumns,
        displayError: {
          onClick: refresh,
          buttonText: 'Prøv igjen',
          error: error,
        },
        loading: loading,
        onClickRetry: refresh,
      }}
    />
  );
};

export default RegelsettList;
