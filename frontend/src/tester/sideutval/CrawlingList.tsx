import AppRoutes, { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import { MenuDropdownProps } from '@common/dropdown/MenuDropdown';
import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { joinStringsToList } from '@common/util/stringutils';
import { CrawlResultat, Maaling } from '@maaling/api/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [menuButtons, setMenuButtons] = useState<MenuDropdownProps | undefined>(
    undefined
  );

  const rowActions = useMemo<TableRowAction[]>(() => {
    if (maalingStatus === 'crawling' || maalingStatus === 'kvalitetssikring') {
      return [
        {
          action: 'restart',
          modalProps: {
            title: 'Køyr utval på nytt',
            disabled: crawlList.length === 0,
            message: `Vil du køyre nytt utval for ${joinStringsToList(
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

  useEffect(() => {
    const failedCrawlings = crawlList.filter((tr) => tr.type === 'feilet');

    if (failedCrawlings.length > 0) {
      setMenuButtons({
        title: 'Meny for testresultat',
        disabled: loading,
        actions: [
          {
            action: 'restart',
            modalProps: {
              title: 'Kjør sideutval for feila',
              disabled: crawlList.length === 0,
              message: `Vil du køyra sideutval for alle feila på nytt?`,
              onConfirm: () => onClickRestart(failedCrawlings),
            },
          },
        ],
      });
    } else {
      setMenuButtons(undefined);
    }
  }, [crawlList]);

  return (
    <UserActionTable<CrawlResultat>
      heading="Sideutval"
      subHeading={`Måling: ${maaling?.navn ?? ''}`}
      linkPath={
        maaling
          ? getFullPath(AppRoutes.MAALING, {
              id: id,
              pathParam: idPath,
            })
          : undefined
      }
      menuButtons={menuButtons}
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
    />
  );
};

export default CrawlingList;
