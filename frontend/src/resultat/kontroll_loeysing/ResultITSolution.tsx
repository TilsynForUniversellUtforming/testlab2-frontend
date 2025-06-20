import { Outlet, useLoaderData } from 'react-router-dom';
import { ResultatOversiktLoeysing } from '@resultat/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';

const ResultITSolution = () => {
  const resultat = useLoaderData() as ResultatOversiktLoeysing[];

  const kontrollNamn = resultat[0].kontrollNamn;

  const typeKontroll = sanitizeEnumLabel(resultat[0].typeKontroll);

  const loeysingNamn = resultat[0].loeysingNamn;

  return (
    <Outlet context={{ resultat, kontrollNamn, typeKontroll, loeysingNamn }} />
  );
};

export default ResultITSolution;
