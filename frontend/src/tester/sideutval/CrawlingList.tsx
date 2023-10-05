import AppRoutes, { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { joinStringsToList } from '@common/util/stringutils';
import { CrawlResultat, Maaling } from '@maaling/api/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StatusChart from '../chart/StatusChart';
import { getCrawlColumns, getCrawlColumnsLoading } from './CrawlColumns';

export interface Props {
  id: string;
  maaling?: Maaling;
  crawlList: CrawlResultat[];
  onClickRestart: (crawlRowSelection: CrawlResultat[]) => void;
  refresh: () => void;
  loading: boolean;
  error: Error | undefined;
  refreshing: boolean;
}

const CrawlingList = ({
  id,
  maaling,
  crawlList,
  onClickRestart,
  refresh,
  loading,
  error,
  refreshing,
}: Props) => {
  const navigate = useNavigate();
  const maalingStatus = maaling?.status;
  const [crawlRowSelection, setCrawlRowSelection] = useState<CrawlResultat[]>(
    []
  );

  const rowActions = useMemo<TableRowAction[]>(() => {
    const actions: TableRowAction[] = [];
    if (maalingStatus === 'crawling' || maalingStatus === 'kvalitetssikring') {
      actions.push({
        action: 'restart',
        rowSelectionRequired: true,
        modalProps: {
          title: 'Køyr utval på nytt',
          disabled: crawlList.length === 0,
          message: `Vil du køyre nytt utval for ${joinStringsToList(
            crawlRowSelection.map((r) => r.loeysing.namn)
          )} på nytt?`,
          onConfirm: () => onClickRestart(crawlRowSelection),
        },
      });

      const failedCrawlings = crawlList.filter((tr) => tr.type === 'feilet');
      if (maalingStatus === 'kvalitetssikring' && failedCrawlings.length > 0) {
        actions.push({
          action: 'restart',
          modalProps: {
            title: 'Kjør sideutval for feila',
            disabled: crawlList.length === 0,
            message: `Vil du køyra sideutval for alle feila på nytt?`,
            onConfirm: () => onClickRestart(failedCrawlings),
          },
        });
      }
    }

    return actions;
  }, [maalingStatus, crawlList, crawlRowSelection]);

  const crawlColumns = useMemo(() => {
    if (typeof maaling !== 'undefined') {
      return getCrawlColumns(maaling);
    } else {
      return getCrawlColumnsLoading();
    }
  }, [maaling]);

  const onClickRefresh = useCallback(() => {
    setCrawlRowSelection([]);
    refresh();
  }, []);

  return (
    <UserActionTable<CrawlResultat>
      heading="Sideutval"
      subHeading={maaling?.navn ? `Måling: ${maaling.navn}` : undefined}
      linkPath={
        maaling
          ? getFullPath(AppRoutes.MAALING, {
              id: id,
              pathParam: idPath,
            })
          : undefined
      }
      tableProps={{
        data: crawlList,
        defaultColumns: crawlColumns,
        displayError: {
          errorHeader: 'Problem med handling',
          error: error,
          buttonText: 'Hent på nytt',
          onClick: onClickRefresh,
        },
        loading: loading,
        onSelectRows: setCrawlRowSelection,
        onClickRetry: onClickRefresh,
        rowActions: rowActions,
        onClickRow:
          maalingStatus !== 'planlegging'
            ? (row) =>
                navigate(
                  getFullPath(
                    appRoutes.TEST_CRAWLING_RESULT_LIST,
                    { pathParam: idPath, id: String(maaling?.id) },
                    {
                      pathParam: ':loeysingId',
                      id: String(row?.original.loeysing.id),
                    }
                  )
                )
            : undefined,
      }}
    >
      <StatusChart
        pendingStatus={{
          statusText: 'Ikkje starta',
          statusCount: maaling?.crawlStatistics?.numPending ?? 0,
        }}
        runningStatus={{
          statusText: 'Crawler',
          statusCount: maaling?.crawlStatistics?.numRunning ?? 0,
        }}
        finishedStatus={{
          statusText: 'Ferdig',
          statusCount: maaling?.crawlStatistics?.numFinished ?? 0,
        }}
        errorStatus={{
          statusText: 'Feila',
          statusCount: maaling?.crawlStatistics?.numError ?? 0,
        }}
        show={!loading && maaling?.status !== 'planlegging'}
        loadingStateStatus={refreshing ? 'Utfører sideutval...' : undefined}
      />
    </UserActionTable>
  );
};

export default CrawlingList;
