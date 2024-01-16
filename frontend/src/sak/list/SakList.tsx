import TestlabLinkButton from '@common/button/TestlabLinkButton';
import TestlabTable from '@common/table/TestlabTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Heading } from '@digdir/design-system-react';
import { SakListeElement } from '@sak/api/types';
import { SAK, SAK_CREATE } from '@sak/SakRoutes';
import { ColumnDef } from '@tanstack/react-table';
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
  ];

  return (
    <div className="sak-list">
      <Heading level={1}>Alle saker</Heading>
      <TestlabLinkButton route={SAK_CREATE} title="Opprett ny" />
      <TestlabTable
        data={saker}
        defaultColumns={columns}
        filterPreference="none"
        onClickRow={(row) => {
          navigate(
            getFullPath(SAK, {
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
