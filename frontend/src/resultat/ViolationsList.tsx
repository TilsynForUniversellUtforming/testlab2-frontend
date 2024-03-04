import UserActionTable from '@common/table/UserActionTable';
import { AutotesterResult } from '@maaling/api/types';
import { getTestresultatColumns } from '@resultat/ResultColumns';
import React, { useMemo } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const ViolationsList = () => {
  const { id, testregelId } = useParams();

  console.log('id: ', id);

  const testResults: AutotesterResult[] = useLoaderData() as AutotesterResult[];

  const testResultatColumns = useMemo(() => getTestresultatColumns(), []);

  console.log('testResults: ', testResults);

  return (
    <UserActionTable<AutotesterResult>
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
