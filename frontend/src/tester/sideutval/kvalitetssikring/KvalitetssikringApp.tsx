import './kvalitetssikring.scss';

import AppRoutes, { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import { MenuDropdownProps } from '@common/dropdown/MenuDropdown';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import { RowCheckbox } from '@common/table/control/toggle/IndeterminateCheckbox';
import { CellCheckboxId, TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain, joinStringsToList } from '@common/util/stringutils';
import { restart } from '@maaling/api/maaling-api';
import { Maaling, RestartRequest } from '@maaling/api/types';
import { CrawlUrl, MaalingContext } from '@maaling/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

const getLoeysingCrawlResultat = (
  loeysingId?: string,
  maaling?: Maaling
): CrawlUrl[] =>
  maaling?.crawlResultat
    ?.find((m) => String(m.loeysing.id) === loeysingId)
    ?.urlList?.map((url) => ({
      url,
    })) ?? [];

const KvalitetssikringApp = () => {
  const navigate = useNavigate();
  const { id: maalingId, loeysingId } = useParams();

  const {
    contextError,
    contextLoading,
    maaling,
    setMaaling,
    refreshMaaling,
  }: MaalingContext = useOutletContext();

  const [loading, setLoading] = useState(contextLoading);
  const [error, setError] = useError(contextError);
  const [urlRowSelection, setUrlRowSelection] = useState<CrawlUrl[]>([]);
  const [loeysingCrawlUrlList, setLoeysingCrawlUrlList] = useState<CrawlUrl[]>(
    getLoeysingCrawlResultat(loeysingId, maaling)
  );

  useEffect(() => {
    if (!contextLoading) {
      setLoeysingCrawlUrlList(getLoeysingCrawlResultat(loeysingId, maaling));
    }
  }, [contextLoading, maaling]);

  const crawlResultat = maaling?.crawlResultat;
  const maalingStatus = maaling?.status;

  const loeysingCrawResultat = crawlResultat?.find(
    (m) => String(m.loeysing.id) === loeysingId
  );

  const onClickRestart = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      try {
        if (maalingId && loeysingId) {
          const restartCrawlingRequest: RestartRequest = {
            maalingId: Number(maalingId),
            loeysingIdList: { idList: [Number(loeysingId)] },
            process: 'crawling',
          };

          const restartedMaaling = await restart(restartCrawlingRequest);
          setMaaling(restartedMaaling);

          navigate(
            getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              id: maalingId,
              pathParam: idPath,
            })
          );
        } else {
          setError(new Error('Testresultat finnes ikkje'));
        }
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved omstart av sideutval'));
      }
    };

    fetchData().finally(() => {
      setLoading(false);
    });
  }, []);

  const onClickDeleteLoeysing = useCallback(() => {
    console.log('Sletter løysing');
  }, []);

  const onClickRemoveUrl = useCallback(() => {
    console.log(urlRowSelection);
  }, [urlRowSelection]);

  const onSelectRows = useCallback((rowSelection: CrawlUrl[]) => {
    setUrlRowSelection(rowSelection);
  }, []);

  const urlColumns = useMemo<ColumnDef<CrawlUrl>[]>(() => {
    if (maalingStatus === 'kvalitetssikring') {
      return [
        {
          id: CellCheckboxId,
          cell: ({ row }) => (
            <RowCheckbox row={row} ariaLabel={`Velg ${row.original.url}`} />
          ),
          size: 1,
        },
        {
          accessorFn: (row) => row.url,
          id: 'url',
          cell: ({ row }) => (
            <Link to={row.original.url} target="_blank">
              {row.original.url}
            </Link>
          ),
          header: () => <>URL</>,
        },
      ];
    } else {
      return [
        {
          accessorFn: (row) => row.url,
          id: 'url',
          cell: ({ row }) => (
            <Link to={row.original.url} target="_blank">
              {row.original.url}
            </Link>
          ),
          header: () => <>URL</>,
        },
      ];
    }
  }, [maalingStatus]);

  const rowActions = useMemo<TableRowAction[]>(() => {
    if (maalingStatus === 'kvalitetssikring') {
      return [
        {
          action: 'delete',
          modalProps: {
            title: 'Ta nettstad ut av måling',
            message: `Vil du ta ut ${joinStringsToList(
              urlRowSelection.map((selection) => selection.url)
            )} frå måling?`,
            onConfirm: onClickRemoveUrl,
          },
        },
      ];
    } else {
      return [];
    }
  }, [maalingStatus, urlRowSelection]);

  const menuButtons = useMemo<MenuDropdownProps | undefined>(() => {
    if (['crawling', 'kvalitetssikring'].includes(maalingStatus ?? '')) {
      return {
        title: 'Meny for testresultat',
        disabled: contextLoading,
        actions: [
          {
            action: 'restart',
            modalProps: {
              title: 'Køyr utval på nytt',
              message: `Vil du køyre nytt utval for ${extractDomain(
                loeysingCrawResultat?.loeysing?.url
              )}?`,
              onConfirm: onClickRestart,
            },
          },
          {
            action: 'delete',
            modalProps: {
              title: 'Ta løysing ut av måling',
              message: `Vil du ta løysing ${extractDomain(
                loeysingCrawResultat?.loeysing?.url
              )} ut av måling?`,
              onConfirm: onClickDeleteLoeysing,
            },
          },
        ],
      };
    }
  }, [maalingStatus]);

  return (
    <UserActionTable<CrawlUrl>
      heading={`Sideutval ${extractDomain(loeysingCrawResultat?.loeysing.url)}`}
      subHeading={maaling?.navn ? `Måling: ${maaling?.navn}` : ''}
      loading={loading}
      linkPath={
        maaling
          ? getFullPath(AppRoutes.MAALING, {
              id: String(maaling.id),
              pathParam: idPath,
            })
          : undefined
      }
      tableProps={{
        data: loeysingCrawlUrlList,
        defaultColumns: urlColumns,
        loading: contextLoading,
        onClickRetry: refreshMaaling,
        displayError: {
          error: error,
        },
        onSelectRows: onSelectRows,
        filterPreference: 'searchbar',
        rowActions: rowActions,
      }}
      menuButtons={menuButtons}
    />
  );
};

export default KvalitetssikringApp;
