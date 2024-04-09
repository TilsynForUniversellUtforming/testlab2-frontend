import UserActionTable from '@common/table/UserActionTable';
import { ColumnDef } from '@tanstack/react-table';
import { Verksemd, VerksemdContext } from '@verksemder/api/types';
import { getVerksemdColumns } from '@verksemder/list/VerksemdColumns';
import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const VerksemdList = () => {
  const { verksemdList, contextLoading }: VerksemdContext = useOutletContext();

  const [loading, setLoading] = useState(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const verksemdColumns = useMemo<ColumnDef<Verksemd>[]>(
    () => getVerksemdColumns(),
    []
  );

  return (
    <UserActionTable<Verksemd>
      heading="Verksemder"
      subHeading="Liste over alle verksemder"
      tableProps={{
        data: verksemdList,
        defaultColumns: verksemdColumns,
        loading: loading,
      }}
    />
  );
};

export default VerksemdList;
