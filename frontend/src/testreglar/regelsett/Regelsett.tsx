import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import DigdirLinkButton from '../../common/button/DigdirLinkButton';
import routes from '../../common/routes';
import DigdirTable from '../../common/table/DigdirTable';
import { TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';

const Regelsett = () => {
  const { error, loading, regelsett }: TestregelContext = useOutletContext();

  const testRegelColumns: ColumnDef<TestRegelsett>[] = [
    {
      accessorFn: (row) => row.namn,
      id: 'Navn',
      cell: (info) => info.getValue(),
      header: () => <span>Navn</span>,
    },
    {
      accessorFn: (row) => row.testreglar.map((tr) => tr.Navn).join(','),
      id: 'TestregelId',
      cell: ({ row }) => (
        <ListGroup className="testreglar-regelsett__list" as="ol" numbered>
          {row.original.testreglar.map((tr) => (
            <ListGroup.Item key={tr.Navn} as="li">
              {tr.Navn}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ),
      header: () => <span>Testregler</span>,
    },
  ];

  return (
    <>
      <DigdirLinkButton
        type="add"
        route={routes.NYTT_REGELSETT}
        disabled={loading}
      />
      <DigdirTable<TestRegelsett>
        data={regelsett}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        customStyle={{ small: true }}
      />
    </>
  );
};

export default Regelsett;
