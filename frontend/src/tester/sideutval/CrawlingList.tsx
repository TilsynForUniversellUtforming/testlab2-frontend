import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import UserActions from '../../common/table/user-actions/UserActions';
import { CrawlResultat } from '../../maaling/api/types';

export interface Props {
  maalingId: number;
  crawlList: CrawlResultat[];
  error: any;
}

const CrawlingList = ({ maalingId, crawlList, error }: Props) => {
  const navigate = useNavigate();

  const onClickEdit = useCallback((row: Row<CrawlResultat>) => {
    const path = getFullPath(
      appRoutes.TEST_CRAWLING_RESULT_LIST,
      { pathParam: idPath, id: String(maalingId) },
      {
        pathParam: ':loeysingId',
        id: String(row.original.loeysing.id),
      }
    );

    navigate(path);
  }, []);

  const crawlColumns = useMemo<ColumnDef<CrawlResultat>[]>(
    () => [
      {
        id: 'Handling',
        cell: ({ row }) => {
          const status = row.original.type;
          const tooltip = `Gå til løysing ${row.original.loeysing.url}`;

          if (status !== 'ikke_ferdig') {
            return (
              <UserActions
                editAction={onClickEdit}
                editTooltip={tooltip}
                row={row}
              />
            );
          } else {
            return null;
          }
        },
        enableSorting: false,
        size: 1,
      },
      {
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: ({ row }) => <span>{row.original.loeysing.url}</span>,
        header: () => <span>Løsying</span>,
      },
      {
        accessorFn: (row) => row.loeysing.namn,
        id: 'namn',
        cell: (info) => info.getValue(),
        header: () => <span>Verksemd</span>,
      },
      {
        accessorFn: (row) => row.type,
        id: 'status',
        cell: ({ row }) => {
          const urlLength = row.original.urlList?.length;
          const status = row.original.type;
          const crawlSuccess =
            status === 'ferdig' && typeof urlLength !== 'undefined';

          const label = crawlSuccess
            ? `Ferdig - Fant ${urlLength} sider`
            : status;

          return (
            <StatusBadge
              label={label}
              levels={{
                primary: 'ikke_ferdig',
                danger: 'feilet',
                success: 'ferdig',
                isSuccess: crawlSuccess,
              }}
            />
          );
        },
        header: () => <span>Status</span>,
      },
    ],
    []
  );

  return (
    <TestlabTable<CrawlResultat>
      data={crawlList}
      defaultColumns={crawlColumns}
      error={error}
      filterPreference="searchbar"
    />
  );
};

export default CrawlingList;
