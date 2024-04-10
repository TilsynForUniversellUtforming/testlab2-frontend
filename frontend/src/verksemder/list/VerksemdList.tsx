import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { ColumnDef } from '@tanstack/react-table';
import { Verksemd, VerksemdContext } from '@verksemder/api/types';
import { getVerksemdColumns } from '@verksemder/list/VerksemdColumns';
import { VERKSEMD_EDIT } from '@verksemder/VerksemdRoutes';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const VerksemdList = () => {
  const { verksemdList, contextLoading }: VerksemdContext = useOutletContext();
  const navigate = useNavigate();

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
        onClickRow: (row) =>
          navigate(
            getFullPath(VERKSEMD_EDIT, {
              pathParam: idPath,
              id: String(row?.original.id),
            })
          ),
      }}
    />
  );
};

export default VerksemdList;
