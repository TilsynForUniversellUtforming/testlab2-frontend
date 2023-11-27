import UserActionTable from '@common/table/UserActionTable';
import { List, ListItem } from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

const RegelsettList = () => {
  const { contextError, contextLoading, regelsett, refresh }: TestregelContext =
    useOutletContext();

  const [loading, setLoading] = useState<boolean>(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const regelsettColumns: ColumnDef<TestRegelsett>[] = [
    {
      accessorFn: (row) => row.namn,
      id: 'Namn',
      cell: (info) => info.getValue(),
      header: () => <>Namn</>,
    },
    {
      accessorFn: (row) =>
        row.testregelList.map((tr) => `${tr.name}`).join(','),
      id: 'Testregel',
      cell: ({ row }) => (
        <List className="testreglar-regelsett__list">
          {row.original.testregelList.map((tr) => (
            <ListItem key={tr.id} className="testreglar-regelsett__list-item">
              {tr.name}
            </ListItem>
          ))}
        </List>
      ),
      header: () => <>Testregler</>,
    },
  ];

  return (
    <UserActionTable<TestRegelsett>
      heading="Regelsett"
      subHeading="Liste over alle regelsett"
      tableProps={{
        data: regelsett,
        defaultColumns: regelsettColumns,
        displayError: {
          onClick: refresh,
          buttonText: 'Prøv igjen',
          error: contextError,
        },
        loading: loading,
        onClickRetry: refresh,
      }}
    />
  );
};

export default RegelsettList;
