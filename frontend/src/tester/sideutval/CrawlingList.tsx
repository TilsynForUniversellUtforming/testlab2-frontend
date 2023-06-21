import React, { useCallback, useMemo, useState } from 'react';

import AppRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import { TableRowAction } from '../../common/table/types';
import UserActionTable from '../../common/table/UserActionTable';
import { joinStringsToList } from '../../common/util/stringutils';
import { CrawlResultat, Maaling } from '../../maaling/api/types';
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
  const maalingStatus = maaling?.status;

  const [crawlRowSelection, setCrawlRowSelection] = useState<CrawlResultat[]>(
    []
  );

  const rowActions = useMemo<TableRowAction[]>(() => {
    if (maalingStatus === 'crawling' || maalingStatus === 'kvalitetssikring') {
      return [
        {
          action: 'restart',
          modalProps: {
            title: 'Crawl på nytt',
            disabled: crawlList.length === 0,
            message: `Vil du crawle ${joinStringsToList(
              crawlRowSelection.map((r) => r.loeysing.namn)
            )} på nytt?`,
            onConfirm: () => onClickRestart(crawlRowSelection),
          },
        },
      ];
    } else {
      return [];
    }
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
      subHeading={`Måling: ${maaling?.navn}`}
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
        loadingStateStatus: refreshing ? 'Utfører sideutval...' : undefined,
      }}
    />
  );
};

export default CrawlingList;
