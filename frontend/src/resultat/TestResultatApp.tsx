import UserActionTable from '@common/table/UserActionTable';
import { getResultColumns } from '@resultat/ResultColumns';
import { ResultatOversiktLoeysing } from '@resultat/types';
import React, { useMemo } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

const TestResultatApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const testResultList: ResultatOversiktLoeysing[] =
    useLoaderData() as ResultatOversiktLoeysing[];
  const testResultatColumns = useMemo(() => getResultColumns(), []);

  return (
    <UserActionTable<ResultatOversiktLoeysing>
      heading={`Resultat test ${id}`}
      tableProps={{
        data: testResultList ?? [],
        defaultColumns: testResultatColumns,
        onClickRow: (row) => navigate(String(row?.original.krav ?? '')),
      }}
    />
  );
};

export default TestResultatApp;
