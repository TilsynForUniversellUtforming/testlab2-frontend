import React, { useCallback, useMemo, useState } from 'react';

import { TableRowAction } from '../../common/table/types';
import UserActionTable from '../../common/table/UserActionTable';
import { CrawlResultat, Maaling } from '../../maaling/api/types';
import { getCrawlColumns } from './CrawlColumns';

export interface Props {
  maaling: Maaling;
  crawlList: CrawlResultat[];
  onClickRestart: (crawlRowSelection: CrawlResultat[]) => void;
  refresh: () => void;
  loading: boolean;
  error: Error | undefined;
  refreshing: boolean;
}

const CrawlingList = ({
  maaling,
  crawlList,
  onClickRestart,
  refresh,
  loading,
  error,
  refreshing,
}: Props) => {
  const maalingStatus = maaling.status;

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
            message: `Vil du crawle på nytt ${crawlRowSelection
              .map((r) => r.loeysing.namn)
              .join(',')}?`,
            onConfirm: () => onClickRestart(crawlRowSelection),
          },
        },
      ];
    } else {
      return [];
    }
  }, [maalingStatus, crawlList, crawlRowSelection]);

  const crawlColumns = useMemo(() => getCrawlColumns(maaling), [maaling]);

  const onClickRefresh = useCallback(() => {
    setCrawlRowSelection([]);
    refresh();
  }, []);

  return (
    <UserActionTable<CrawlResultat>
      heading="Sideutval"
      subHeading={maaling.navn}
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
        loadingStateStatus: refreshing ? 'Utfører sideutvalg...' : undefined,
      }}
    />
  );
};

export default CrawlingList;
