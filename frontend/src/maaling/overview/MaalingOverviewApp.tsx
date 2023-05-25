import { Spinner, Tabs } from '@digdir/design-system-react';
import React from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import {
  appRoutes,
  editPath,
  getFullPath,
  idPath,
} from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import { MaalingContext } from '../types';

const MaalingOverviewApp = () => {
  const context: MaalingContext = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();

  if (context.contextLoading) {
    return <Spinner title="Hentar målingar" variant={'default'} />;
  }

  if (!context.maaling || context.contextError) {
    return <ErrorCard />;
  }

  const { navn } = context.maaling;

  const handleChange = (name: string) => {
    if (name === 'Rediger måling') {
      navigate(editPath);
    } else {
      navigate(
        getFullPath(appRoutes.MAALING, { id: String(id), pathParam: idPath })
      );
    }
  };

  return (
    <>
      <AppTitle heading={navn} />
      <Tabs
        activeTab={lastSegment === editPath ? 'Rediger måling' : 'Oversikt'}
        items={[
          {
            name: 'Oversikt',
            content: <></>,
          },
          {
            name: 'Rediger måling',
            content: <></>,
          },
          {
            name: 'Nettløysingar',
            content: <></>,
          },
          {
            name: 'Testreglar',
            content: <></>,
          },
          {
            name: 'Testresultat',
            content: <></>,
          },
        ]}
        onChange={handleChange}
      />
      <Outlet context={context} />
    </>
  );
};

export default MaalingOverviewApp;
