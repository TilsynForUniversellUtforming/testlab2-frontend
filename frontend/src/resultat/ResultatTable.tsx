import '@common/table/testlabTable.scss';
import './resultat.scss';

import ErrorCard, { TestlabError } from '@common/error/ErrorCard';
import PaginationContainer from '@common/table/control/pagination/PaginationContainer';
import TestlabTableBody from '@common/table/TestlabTableBody';
import TestlabTableHeader from '@common/table/TestlabTableHeader';
import { getFullPath } from '@common/util/routeUtils';
import {
  Button,
  ErrorMessage,
  Table,
  Tabs,
} from '@digdir/designsystemet-react';
import ResultatListTableBody from '@resultat/ResultatListTableBody';
import {
  RESULTAT_KRAV_LIST,
  RESULTAT_ROOT,
  RESULTAT_TEMA_LIST,
} from '@resultat/ResultatRoutes';
import ResultTableActions from '@resultat/ResultTableActions';
import ResultTableHeader from '@resultat/ResultTableHeader';
import { resultTable } from '@resultat/tableoptions';
import { Column, ColumnDef, Row, VisibilityState } from '@tanstack/react-table';
import classnames from 'classnames';
import React, { ReactElement, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { KontrollType } from '../kontroll/types';

export interface ResultTableProps<T extends object> {
  tableParams: TableParams<T>;
  topLevelList?: boolean;
  typeKontroll?: string;
  kontrollNamn?: string;
  loeysingNamn?: string;
  hasFilter?: boolean;
  subHeader?: string;
  onSubmitCallback?: (
    kontrollId?: number,
    kontrollType?: KontrollType,
    fraDato?: Date,
    tilDato?: Date
  ) => void;
  rapportButton?: boolean;
}

export interface TableParams<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  onClickRow?: (row?: Row<T>, subRow?: Row<T>) => void;
  onClickRetry?: () => void;
  visibilityState: (visDetaljer: boolean) => VisibilityState;
  displayError?: TestlabError;
  actionRequiredError?: string;
  loading?: boolean;
}

// export interface tableHeaderParams<T extends object> {
//
// }
const ResultatTable = <T extends object>({
  tableParams,
  topLevelList = false,
  typeKontroll,
  kontrollNamn,
  loeysingNamn,
  hasFilter = false,
  subHeader,
  onSubmitCallback,
  rapportButton = false,
}: ResultTableProps<T>): ReactElement => {
  const [visDetaljer, setVisDetaljer] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [...tableParams.defaultColumns];

  const showDetails = () => {
    setVisDetaljer(!visDetaljer);
    setColumnVisibility(tableParams.visibilityState(visDetaljer));
  };

  const location = useLocation();

  const getPath = (tab: string) => {
    switch (tab) {
      case 'resultat':
        return getFullPath(RESULTAT_ROOT);
      case 'tema':
        return getFullPath(RESULTAT_TEMA_LIST);
      case 'krav':
        return getFullPath(RESULTAT_KRAV_LIST);
      default:
        return 'resultat';
    }
  };

  function getCurrentPath() {
    return location.pathname.split('/').pop() ?? 'resultat';
  }

  const [activeTab, setActiveTab] = useState<string>(getCurrentPath());
  const onChangeTabs = useCallback((tab: string) => {
    setActiveTab(tab);
    navigate(getPath(tab));
  }, []);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(tableParams.visibilityState(visDetaljer));

  const table = resultTable(
    tableParams.data,
    columns,
    columnVisibility,
    setColumnVisibility
  );

  const handleClickRetry = () => {
    table.toggleAllRowsSelected(false);
    if (tableParams.onClickRetry) {
      tableParams.onClickRetry();
    }
  };

  if (tableParams.displayError?.error) {
    return (
      <ErrorCard
        errorHeader={tableParams.displayError.errorHeader}
        error={tableParams.displayError.error}
        onClick={tableParams.displayError.onClick ?? handleClickRetry}
        buttonText={tableParams.displayError.buttonText ?? 'Prøv igjen'}
      />
    );
  }

  function getFilterColumns(): Column<T, unknown>[] | undefined {
    if (hasFilter && topLevelList) {
      const kontrollTypeColumn: Column<T, unknown> | undefined =
        table.getColumn('type');
      const dateColumn: Column<T, unknown> | undefined =
        table.getColumn('dato');
      if (kontrollTypeColumn && dateColumn) {
        return [kontrollTypeColumn, dateColumn];
      }
    }
  }

  const filterColumns = getFilterColumns();

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="testlab-table">
      <ResultTableHeader
        filterColumns={filterColumns}
        typeKontroll={typeKontroll}
        kontrollNamn={kontrollNamn}
        loeysingNamn={loeysingNamn}
        subHeader={subHeader}
        onSubmitCallback={onSubmitCallback}
      ></ResultTableHeader>
      {rapportButton && <ResultTableActions />}
      <Tabs value={activeTab} onChange={onChangeTabs}>
        <Tabs.List>
          <Tabs.Tab value={'resultat'}>Resultat</Tabs.Tab>
          <Tabs.Tab value={'tema'}>Sortert på tema</Tabs.Tab>
          <Tabs.Tab value={'krav'}>Sortert på krav</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value={activeTab}>
          <Table
            className={classnames('testlab-table__table', 'resultat-table', {
              'table-error': !!tableParams.actionRequiredError,
            })}
          >
            <Table.Head>
              <Table.Row>
                {headerGroup.headers.map((header) => (
                  <TestlabTableHeader<T>
                    header={header}
                    loading={tableParams.loading}
                    key={header.column.id}
                  />
                ))}
                <Table.HeaderCell>
                  {topLevelList && (
                    <Button onClick={showDetails} className="vis-detaljer">
                      {' '}
                      Vis detaljer
                    </Button>
                  )}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {topLevelList && (
                <ResultatListTableBody<T>
                  table={table}
                  loading={tableParams.loading}
                  onClickRow={tableParams.onClickRow}
                />
              )}
              {!topLevelList && (
                <TestlabTableBody<T>
                  table={table}
                  loading={tableParams.loading}
                  onClickCallback={tableParams.onClickRow}
                />
              )}
            </Table.Body>
            <Table.Head>
              <Table.Row className="testlab-table__footer">
                <PaginationContainer
                  table={table}
                  loading={tableParams.loading}
                />
              </Table.Row>
            </Table.Head>
          </Table>
        </Tabs.Content>
      </Tabs>
      {tableParams.actionRequiredError && (
        <ErrorMessage size="small">
          {tableParams.actionRequiredError}
        </ErrorMessage>
      )}
    </div>
  );
};

export default ResultatTable;
