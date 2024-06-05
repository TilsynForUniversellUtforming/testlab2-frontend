import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { VIOLATION_LIST } from '@resultat/ResultatRoutes';
import { getResultColumns } from '@resultat/ResultColumns';
import { ResultatOversiktLoeysing } from '@resultat/types';
import React, { useMemo } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

const TestResultatApp = () => {
  const { id, loeysingId } = useParams();
  const navigate = useNavigate();

  const testResultList: ResultatOversiktLoeysing[] =
    useLoaderData() as ResultatOversiktLoeysing[];
  const testResultatColumns = useMemo(() => getResultColumns(), []);

  const getPathViolations = (kravId: string): string => {
    return getFullPath(
      VIOLATION_LIST,
      {
        pathParam: idPath,
        id: String(id),
      },
      {
        pathParam: ':loeysingId',
        id: String(loeysingId),
      },
      {
        pathParam: ':kravId',
        id: kravId,
      }
    );
  };

  return (
    <UserActionTable<ResultatOversiktLoeysing>
      heading={`Resultatvisinig`}
      tableProps={{
        data: testResultList ?? [],
        defaultColumns: testResultatColumns,
        onClickRow: (row) =>
          navigate(getPathViolations(row?.original.krav ?? '')),
      }}
    />
  );
};

export default TestResultatApp;
