import React from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorCard from '../error/ErrorCard';
import Navigation from '../navigation/Navigation';

const AppErrorBoundary = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className="app-container">
        <ErrorCard
          errorHeader="Uventa feil"
          buttonText="Gå til startside"
          onClick={() => navigate('/')}
        />
      </div>
    </>
  );
};

export default AppErrorBoundary;
