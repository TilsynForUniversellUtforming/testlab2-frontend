import UserActionTable from '@common/table/UserActionTable';
import { TesterResult } from '@maaling/api/types';
import { getViolationsColumns } from '@resultat/ResultColumns';
import React, { useMemo } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const ViolationsList = () => {
  const { id, testregelId } = useParams();

  const testResults: TesterResult[] = useLoaderData() as TesterResult[];

  const testResultatColumns = useMemo(() => getViolationsColumns(), []);

  return (
    <UserActionTable<TesterResult>
      heading={`Resultat ${id}`}
      subHeading={`Testregel ${testregelId}`}
      tableProps={{
        data: testResults,
        defaultColumns: testResultatColumns,
      }}
    />
  );
};

export default ViolationsList;
