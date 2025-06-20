import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { getResultColumns } from '@resultat/kontroll_loeysing/ResultColumns';
import { genererWordRapport } from '@resultat/resultat-api';
import { VIOLATION_LIST } from '@resultat/ResultatRoutes';
import ResultatTable, {
  TableHeaderParams,
  TableParams,
} from '@resultat/ResultatTable';
import { TableActionsProps } from '@resultat/ResultTableActions';
import {
  ResultatOversiktLoeysing,
  ResultKontrollContext,
} from '@resultat/types';
import { Row, VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestResultatApp = <T extends object>() => {
  const { id, loeysingId } = useParams();
  const navigate = useNavigate();
  const context: ResultKontrollContext = useOutletContext();
  const testResultList: ResultatOversiktLoeysing[] = context.resultat;

  const testResultatColumns = useMemo(() => getResultColumns(), []);

  const getPathViolations = (testregelId: number): string => {
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
        pathParam: ':testregelId',
        id: String(testregelId),
      }
    );
  };

  const onClickRow = (row?: Row<ResultatOversiktLoeysing>) => {
    const testregelId = row?.original.testregelId as number;
    navigate(getPathViolations(testregelId));
  };

  const getLoeysingNamn = (): string => {
    return context.loeysingNamn;
  };

  const getTypeKontroll = (): string => {
    return sanitizeEnumLabel(context.typeKontroll);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visibilityState = (): VisibilityState => {
    return {
      testregelTittel: true,
      score: true,
      testar: true,
      talTestaElement: true,
      talElementSamsvar: true,
      talElementBrot: true,
    };
  };

  const tableParams: TableParams<ResultatOversiktLoeysing> = {
    data: testResultList,
    defaultColumns: testResultatColumns,
    onClickRow: onClickRow,
    visibilityState: visibilityState,
  };

  const genererRapport = () => {
    genererWordRapport(Number(id), Number(loeysingId));
  };

  const tableActions: TableActionsProps = {
    actionFunction: genererRapport,
    actionsLabel: { activate: 'Generer wordrapport' },
    isActive: false,
  };

  const headerParams: TableHeaderParams = {
    filterParams: { topLevelList: false, hasFilter: false },
    typeKontroll: getTypeKontroll(),
    loeysingNamn: getLoeysingNamn(),
    subHeader: getLoeysingNamn(),
    reportActions: tableActions,
  };

  return (
    <ResultatTable tableParams={tableParams} headerParams={headerParams} />
  );
};

export default TestResultatApp;
