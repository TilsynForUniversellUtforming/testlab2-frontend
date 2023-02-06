import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import useFormatDate from '../../common/hooks/useFormatDate';
import StatusBadge from '../../common/status-badge/StatusBadge';
import IndeterminateCheckbox from '../../common/table/control/toggle/IndeterminateCheckbox';
import DigdirTable from '../../common/table/DigdirTable';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';

const CreateRegelsett = () => {
  const {
    error,
    loading,
    testreglar,
    setRegelsett,
    setError,
    setLoading,
  }: TestregelContext = useOutletContext();

  const handleSubmit = useCallback(() => {
    console.log('submit');
  }, []);

  // const onSubmit = useCallback(() => {
  //   const fetchTestreglar = async () => {
  //     const data = await setRegelsett_dummy(testRegelsett);
  //     setRegelsett(data);
  //   };
  //
  //   setLoading(true);
  //   setError(undefined);
  //
  //   fetchTestreglar()
  //     .catch((e) => setError(e))
  //     .finally(() => setLoading(false));
  // }, []);

  const testRegelColumns = React.useMemo<ColumnDef<Testregel>[]>(
    () => [
      {
        id: 'Handling',
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        size: 1,
      },
      {
        accessorFn: (row) => row.Navn,
        id: 'Navn',
        cell: (info) => info.getValue(),
        header: () => <span>Navn</span>,
      },
      {
        accessorFn: (row) => row.Status,
        id: 'Status',
        cell: (info) => (
          <StatusBadge
            title={`${info.getValue()}`}
            levels={{
              primary: 'Publisert',
              danger: 'Utgår',
              success: 'Klar for testing',
            }}
          />
        ),
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.Dato_endra,
        id: 'Dato_endra',
        cell: (info) => useFormatDate(String(info.getValue())),
        header: () => <span>Dato Endra</span>,
      },
      {
        accessorFn: (row) => row.Type,
        id: 'Type',
        cell: (info) => info.getValue(),
        header: () => <span>Type</span>,
      },
      {
        accessorFn: (row) => row.TestregelId,
        id: 'TestregelId',
        cell: (info) => info.getValue(),
        header: () => <span>Testregel</span>,
      },
      {
        accessorFn: (row) => row.Krav,
        id: 'Krav',
        cell: (info) => info.getValue(),
        header: () => <span>Krav</span>,
      },
    ],
    []
  );

  return (
    <>
      {/*<DigdirButton*/}
      {/*  type="add"*/}
      {/*  disabled={loading}*/}
      {/*  // onClick={onSubmit}*/}
      {/*/>*/}
      <DigdirTable<Testregel>
        data={testreglar}
        defaultColumns={testRegelColumns}
        error={error}
        loading={loading}
        onSubmitSelectRows={handleSubmit}
      />
    </>
  );
};

export default CreateRegelsett;
