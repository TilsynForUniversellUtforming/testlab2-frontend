import { TesterResult } from '@maaling/api/types';
import { getViolationsColumns } from '@resultat/kontroll_loeysing/ResultColumns';
import ResultatTable, {
  TableHeaderParams,
  TableParams,
} from '@resultat/ResultatTable';
import { ResultKontrollContext, ViolationsData } from '@resultat/types';
import { VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';

const ViolationsList = <T extends object>() => {
  const context: ResultKontrollContext = useOutletContext();
  const violationsData = useLoaderData() as ViolationsData;

  const typeKontroll = context.typeKontroll;
  const kontrollNamn = context.kontrollNamn;

  const testResults: TesterResult[] = violationsData.detaljerResultat;
  const resultatLoeysing = violationsData.kontrollData;
  const testregelTittel =
    testResults.length > 0 ? testResults[0].testregelNoekkel : '';
  const loeysing = resultatLoeysing[0].loeysingNamn;

  const testResultatColumns = useMemo(() => getViolationsColumns(), []);

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

  const tableParams: TableParams<TesterResult> = {
    data: testResults,
    defaultColumns: testResultatColumns,
    visibilityState: visibilityState,
  };

  const headerParams: TableHeaderParams = {
    filterParams: { topLevelList: false, hasFilter: false },
    typeKontroll: typeKontroll,
    kontrollNamn: kontrollNamn,
    loeysingNamn: loeysing,
    subHeader: testregelTittel,
  };

  return (
    <ResultatTable tableParams={tableParams} headerParams={headerParams} />
  );
};

export default ViolationsList;
