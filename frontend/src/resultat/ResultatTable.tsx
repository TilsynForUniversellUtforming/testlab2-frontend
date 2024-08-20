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
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  actionRequiredError?: string;
  loading?: boolean;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void;
  onClickRow?: (row?: Row<T>, subRow?: Row<T>) => void;
  onClickRetry?: () => void;
  visibilityState: (visDetaljer: boolean) => VisibilityState;
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
}

/**
 * A TanStack table component for displaying and manipulating data.
 *
 * @template T - The type of data displayed in the table.
 * @param {object} props - The props for the component.
 * @param {T[]} props.data - The data to be displayed in the table.
 * @param {ColumnDef<T>[]} props.defaultColumns - The default columns to display in the table.
 * @param {TestlabError} props.displayError - The error to show in the error card.
 * @param {string} props.actionRequiredError - Optional error message to display if a table requires a user action.
 * @param {boolean} [props.loading=false] - Whether the table is currently loading data.
 * @param {TableFilterPreference} [props.filterPreference='all'] - The default filter preference.
 * @param {boolean[]} [props.selectedRows=[]] - An array indicating which rows are selected.
 * @param {(rows: T[]) => void} [props.onSelectRows] - A function to be called when rows are selected. If defined the row selection is implicitly active
 * @param {(row?: Row<T>) => void} [props.onClickRow] - A optional function to be called when a row is clicked. The clicked row's data will be passed as an argument to the function.
 * @param {() => void} [props.onClickRetry] - A function to be called when the user clicks the retry button.
 * @param {TableStyle} [props.customStyle={ full: true, small: false, fixed: false }] - The custom styles to apply to the table.
 * @param {TableRowAction[]} [props.rowActions] - The actions that can be preformed on the table rows. Assumes that the table is selectable.
 * @returns {ReactElement} - The React component for the TestlabTable.
 */
const ResultatTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  actionRequiredError,
  loading = false,
  onClickRow,
  onClickRetry,
  visibilityState,
  topLevelList = false,
  typeKontroll,
  kontrollNamn,
  loeysingNamn,
  hasFilter = false,
  subHeader,
  onSubmitCallback,
}: ResultTableProps<T>): ReactElement => {
  const [visDetaljer, setVisDetaljer] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [...defaultColumns];

  const showDetails = () => {
    setVisDetaljer(!visDetaljer);
    setColumnVisibility(visibilityState(visDetaljer));
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
    React.useState<VisibilityState>(visibilityState(visDetaljer));

  const table = resultTable(
    data,
    columns,
    columnVisibility,
    setColumnVisibility
  );

  const handleClickRetry = () => {
    table.toggleAllRowsSelected(false);
    if (onClickRetry) {
      onClickRetry();
    }
  };

  if (displayError?.error) {
    return (
      <ErrorCard
        errorHeader={displayError.errorHeader}
        error={displayError.error}
        onClick={displayError.onClick ?? handleClickRetry}
        buttonText={displayError.buttonText ?? 'Prøv igjen'}
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
      <ResultTableActions />
      <Tabs value={activeTab} onChange={onChangeTabs}>
        <Tabs.List>
          <Tabs.Tab value={'resultat'}>Resultat</Tabs.Tab>
          <Tabs.Tab value={'tema'}>Sortert på tema</Tabs.Tab>
          <Tabs.Tab value={'krav'}>Sortert på krav</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value={activeTab}>
          <Table
            className={classnames('testlab-table__table', 'resultat-table', {
              'table-error': !!actionRequiredError,
            })}
          >
            <Table.Head>
              <Table.Row>
                {headerGroup.headers.map((header) => (
                  <TestlabTableHeader<T>
                    header={header}
                    loading={loading}
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
                  loading={loading}
                  onClickRow={onClickRow}
                />
              )}
              {!topLevelList && (
                <TestlabTableBody<T>
                  table={table}
                  loading={loading}
                  onClickCallback={onClickRow}
                />
              )}
            </Table.Body>
            <Table.Head>
              <Table.Row className="testlab-table__footer">
                <PaginationContainer table={table} loading={loading} />
              </Table.Row>
            </Table.Head>
          </Table>
        </Tabs.Content>
      </Tabs>
      {actionRequiredError && (
        <ErrorMessage size="small">{actionRequiredError}</ErrorMessage>
      )}
    </div>
  );
};

export default ResultatTable;
