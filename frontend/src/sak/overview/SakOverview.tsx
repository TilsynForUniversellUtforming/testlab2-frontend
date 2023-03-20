import React from 'react';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { SakContext } from '../types';

const SakOverview = () => {
  const { contextLoading, contextError, maaling }: SakContext =
    useOutletContext();

  if (contextLoading) {
    return <span>SPINNER</span>;
  }

  if (!maaling || contextError) {
    return <ErrorCard />;
  }

  return (
    <div>
      <h4>Løysingar</h4>
      <ol className="w-50 ">
        {maaling.loeysingList.map((lo) => (
          <li key={lo.id}>
            <div className="fw-bold">{lo.namn}</div>
            {lo.url}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SakOverview;
