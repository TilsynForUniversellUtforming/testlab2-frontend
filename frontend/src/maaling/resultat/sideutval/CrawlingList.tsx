import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { joinStringsToList } from '@common/util/stringutils';
import { CrawlResultat, Maaling } from '@maaling/api/types';
import { MAALING, TEST_CRAWLING_RESULT_LIST } from '@maaling/MaalingRoutes';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StatusChart from '../chart/StatusChart';
import { getCrawlColumns } from './CrawlColumns';

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
    if (maalingStatus === 'kvalitetssikring') {
      const failedCrawlings = crawlList.filter((tr) => tr.type === 'feila');
      actions.push({
        action: 'restart',
        rowSelectionRequired: true,
        modalProps: {
          title: 'Køyr utval på nytt',
          disabled: crawlList.length === 0,
          message: `Vil du køyre utval for ${joinStringsToList(
            crawlRowSelection.map((r) => r.loeysing.namn)
          )} på nytt?`,
          onConfirm: () => onClickRestart(crawlRowSelection),
        },
      });

      if (failedCrawlings.length > 0) {
        actions.push({
          action: 'restart',
          modalProps: {
            title: 'Køyr sideutval for feila',
            disabled: crawlList.length === 0,
            message: `Vil du køyra sideutval for alle feila på nytt?`,
            onConfirm: () => onClickRestart(failedCrawlings),
          },
        });
      }
    }

    return actions;
  }, [maalingStatus, crawlList, crawlRowSelection]);

  const crawlColumns = useMemo(() => getCrawlColumns(maaling), [maaling]);

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
          ? getFullPath(MAALING, {
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
                    TEST_CRAWLING_RESULT_LIST,
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
          severity: 'neutral',
        }}
        runningStatus={{
          statusText: 'Crawler',
          statusCount: maaling?.crawlStatistics?.numRunning ?? 0,
          severity: 'info',
        }}
        finishedStatus={{
          statusText: 'Ferdig',
          statusCount: maaling?.crawlStatistics?.numFinished ?? 0,
          severity: 'success',
        }}
        errorStatus={{
          statusText: 'Feila',
          statusCount: maaling?.crawlStatistics?.numError ?? 0,
          severity: 'danger',
        }}
        show={!loading && maaling?.status !== 'planlegging'}
        loadingStateStatus={refreshing ? 'Utfører sideutval...' : undefined}
      />
    </UserActionTable>
  );
};

export default CrawlingList;
