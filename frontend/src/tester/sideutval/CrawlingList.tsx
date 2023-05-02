import './sideutval.scss';

import { ColumnDef, Row } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import appRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import UserAction from '../../common/table/user-actions/UserAction';
import { CrawlResultat } from '../../maaling/api/types';

export interface Props {
  crawlList: CrawlResultat[];
  loading: boolean;
  error: any;
  onClickRestart: (row: Row<CrawlResultat>) => void;
}

const CrawlingList = ({ crawlList, loading, error, onClickRestart }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const onClickEdit = (row: Row<CrawlResultat>) => {
    if (!id) {
      throw Error('Måling finnes ikkje');
    }

    const path = getFullPath(
      appRoutes.TEST_CRAWLING_RESULT_LIST,
      { pathParam: idPath, id: id },
      {
        pathParam: ':loeysingId',
        id: String(row.original.loeysing.id),
      }
    );

    navigate(path);
  };

  const crawlColumns = useMemo<ColumnDef<CrawlResultat>[]>(
    () => [
      {
        id: 'Handling',
        cell: ({ row }) => {
          const status = row.original.type;

          if (status !== 'ikke_ferdig') {
            return (
              <div className="sideutval__table-actions">
                <UserAction<CrawlResultat>
                  action={onClickEdit}
                  columnUserAction="statistics"
                  row={row}
                  title={`Gå til løysing ${row.original.loeysing.url}`}
                  message="Se crawlresultat"
                />
                <UserAction<CrawlResultat>
                  action={onClickRestart}
                  columnUserAction={'redo'}
                  row={row}
                  message={`Start sideutval for ${row.original.loeysing.url} på nytt`}
                  title={`Nytt sideutval for ${row.original.loeysing.namn}`}
                  confirm
                />
              </div>
            );
          } else {
            return null;
          }
        },
        enableSorting: false,
        size: 2,
      },
      {
        accessorFn: (row) => row.loeysing.url,
        id: 'url',
        cell: (info) => info.getValue(),
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

          let label: string;
          if (crawlSuccess) {
            label = `Ferdig - Fant ${urlLength} sider`;
          } else if (status === 'ikke_ferdig') {
            const framgang = row.original.framgang;
            if (framgang != null) {
              label = `Crawler ${framgang.lenkerCrawla} av ${framgang.maxLenker}`;
            } else {
              label = 'Crawler';
            }
          } else {
            label = status;
          }

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
      loading={loading}
      fetchError={error}
      filterPreference="searchbar"
    />
  );
};

export default CrawlingList;
