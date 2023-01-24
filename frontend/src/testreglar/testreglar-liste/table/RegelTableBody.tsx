import React from 'react';

import Testregel from '../../api/Testregel';
import RegelTableSkeleton from '../skeleton/RegelTableSkeleton';
import StatusBadge from '../StatusBadge';

interface Props {
  loading: boolean;
  testreglar: Testregel[];
}

const RegelTableBody = ({ loading, testreglar }: Props) => {
  if (loading) {
    return <RegelTableSkeleton />;
  }

  return (
    <>
      {testreglar.map((testregel) => (
        <tr key={testregel.Id}>
          <td>{testregel.TestregelId}</td>
          <td>{testregel.Navn}</td>
          <td>
            <StatusBadge tittel={testregel.Status} />
          </td>
          <td>{testregel.Dato_endra}</td>
          <td>{testregel.Type}</td>
          <td>{testregel.Modus}</td>
          <td>{testregel.Krav}</td>
        </tr>
      ))}
    </>
  );
};

export default RegelTableBody;
