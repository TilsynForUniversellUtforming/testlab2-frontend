import TestlabLinkButton from '@common/button/TestlabLinkButton';
import TestlabTable from '@common/table/TestlabTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { formatDateString } from '@common/util/stringutils';
import { Heading } from '@digdir/design-system-react';
import { SakListeElement } from '@sak/api/types';
import { SAK_CREATE } from '@sak/SakRoutes';
import { ColumnDef } from '@tanstack/react-table';
import { TEST } from '@test/TestingRoutes';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import('./sak-list.scss');

const SakList = () => {
  const saker: Array<SakListeElement> =
    useLoaderData() as Array<SakListeElement>;
  const navigate = useNavigate();

  const columns: Array<ColumnDef<SakListeElement>> = [
    { accessorKey: 'namn', header: 'Saker' },
    {
      accessorFn: (originalRow) => {
        return originalRow.ansvarleg?.namn ?? 'Ikkje tildelt';
      },
      header: 'Ansvarlig',
    },
    {
      accessorFn: (originalRow) => formatDateString(originalRow.frist),
      header: 'Frist',
    },
  ];

  return (
    <div className="sak-list">
      <Heading level={1}>Alle saker</Heading>
      <TestlabLinkButton route={SAK_CREATE} title="Opprett ny">
        Opprett ny
      </TestlabLinkButton>
      <TestlabTable
        data={saker}
        defaultColumns={columns}
        filterPreference="none"
        onClickRow={(row) => {
          navigate(
            getFullPath(TEST, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          );
        }}
      />
    </div>
  );
};

export default SakList;
