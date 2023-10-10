import './kvalitetssikring.scss';

import AppRoutes, { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import toError from '@common/error/util';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import useError from '@common/hooks/useError';
import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain, joinStringsToList } from '@common/util/stringutils';
import { fetchLoeysingNettsider, restart } from '@maaling/api/maaling-api';
import { RestartRequest } from '@maaling/api/types';
import { CrawlUrl, MaalingContext } from '@maaling/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { getUrlColumns, getUrlColumnsKvalitetssikring } from './GetUrlColumns';

const KvalitetssikringApp = () => {
  const navigate = useNavigate();
  const { id: maalingId, loeysingId } = useParams();

  const { contextError, loadingMaaling, maaling, setMaaling }: MaalingContext =
    useOutletContext();

  const [loading, setLoading] = useState(loadingMaaling);
  const [error, setError] = useError(contextError);
  const [urlRowSelection, setUrlRowSelection] = useState<CrawlUrl[]>([]);
  const [loeysingCrawlUrlList, setLoeysingCrawlUrlList] = useState<CrawlUrl[]>(
    []
  );

  const crawlResultat = maaling?.crawlResultat;
  const maalingStatus = maaling?.status;

  const loeysingCrawResultat = crawlResultat?.find(
    (m) => String(m.loeysing.id) === loeysingId
  );

  useContentDocumentTitle(
    appRoutes.TEST_CRAWLING_RESULT_LIST.navn,
    loeysingCrawResultat?.loeysing?.namn
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
      return getUrlColumnsKvalitetssikring();
    } else {
      return getUrlColumns();
    }
  }, [maalingStatus]);

  const rowActions = useMemo<TableRowAction[]>(() => {
    const actions: TableRowAction[] = [];
    if (maalingStatus === 'kvalitetssikring') {
      actions.push(
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
        {
          action: 'delete',
          rowSelectionRequired: true,
          modalProps: {
            title: 'Ta url ut av måling',
            message: `Vil du ta ut ${joinStringsToList(
              urlRowSelection.map((selection) => selection.url)
            )} frå måling?`,
            onConfirm: onClickRemoveUrl,
          },
        }
      );
    }

    return actions;
  }, [maalingStatus, urlRowSelection]);

  const fetchUrlList = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchUrlList = async () => {
      try {
        if (maalingId && loeysingId) {
          const urlList = await fetchLoeysingNettsider(
            Number(maalingId),
            Number(loeysingId)
          );
          setLoeysingCrawlUrlList(urlList);
        } else {
          setError(new Error('Testresultat finnes ikkje'));
        }
      } catch (e) {
        setError(toError(e, 'Kunne ikkje finne testresultat'));
      }
    };

    doFetchUrlList().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffectOnce(() => {
    fetchUrlList();
  });

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
        loading: loading,
        onClickRetry: fetchUrlList,
        displayError: {
          error: error,
        },
        onSelectRows: onSelectRows,
        filterPreference: 'searchbar',
        rowActions: rowActions,
      }}
    />
  );
};

export default KvalitetssikringApp;
