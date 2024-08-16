import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { getResultColumns } from '@resultat/kontroll_loeysing/ResultColumns';
import { VIOLATION_LIST } from '@resultat/ResultatRoutes';
import ResultatTable from '@resultat/ResultatTable';
import { ResultatOversiktLoeysing } from '@resultat/types';
import { Row, VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

const TestResultatApp = () => {
  const { id, loeysingId } = useParams();
  const navigate = useNavigate();

  const testResultList: ResultatOversiktLoeysing[] =
    useLoaderData() as ResultatOversiktLoeysing[];
  const testResultatColumns = useMemo(() => getResultColumns(), []);

  const getPathViolations = (kravId: number): string => {
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
        id: String(kravId),
      }
    );
  };

  const onClickRow = <T extends object>(row?: Row<T>) => {
    const resultatRow = row as Row<ResultatOversiktLoeysing>;
    if (resultatRow?.original.kravId != undefined) {
      navigate(getPathViolations(resultatRow?.original.kravId as number));
    }
  };

  const getLoeysingNamn = (): string => {
    const resultat = testResultList[0] as ResultatOversiktLoeysing;
    return resultat.loeysingNamn;
  };

  const getTypeKontroll = (): string => {
    const resultat = testResultList[0] as ResultatOversiktLoeysing;
    return sanitizeEnumLabel(resultat.typeKontroll);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visibilityState = (visDetaljer: boolean): VisibilityState => {
    return {
      kravTittel: true,
      score: true,
      testar: true,
      talTestaElement: true,
      talElementSamsvar: true,
      talElementBrot: true,
    };
  };

  return (
    <ResultatTable
      data={testResultList}
      defaultColumns={testResultatColumns}
      onClickRow={onClickRow}
      visibilityState={visibilityState}
      typeKontroll={getTypeKontroll()}
      loeysingNamn={getLoeysingNamn()}
      subHeader={getLoeysingNamn()}
    />
  );
};

export default TestResultatApp;
