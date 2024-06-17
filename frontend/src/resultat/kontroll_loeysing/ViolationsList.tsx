import { sanitizeEnumLabel } from '@common/util/stringutils';
import { TesterResult } from '@maaling/api/types';
import { getViolationsColumns } from '@resultat/kontroll_loeysing/ResultColumns';
import ResultatTable from '@resultat/ResultatTable';
import { ViolationsData } from '@resultat/types';
import { VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

const ViolationsList = () => {
  const violationsData = useLoaderData() as ViolationsData;

  const testResults: TesterResult[] = violationsData.detaljerResultat;
  const resultatLoeysing = violationsData.kontrollData;
  const krav = violationsData.krav.tittel;
  const kontrollNamn = resultatLoeysing[0].kontrollNamn;
  const typeKontroll = sanitizeEnumLabel(resultatLoeysing[0].typeKontroll);
  const loeysing = resultatLoeysing[0].loeysingNamn;

  const testResultatColumns = useMemo(() => getViolationsColumns(), []);

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
      data={testResults}
      defaultColumns={testResultatColumns}
      visibilityState={visibilityState}
      typeKontroll={typeKontroll}
      kontrollNamn={kontrollNamn}
      loeysingNamn={loeysing}
      subHeader={krav}
    />
  );
};

export default ViolationsList;
