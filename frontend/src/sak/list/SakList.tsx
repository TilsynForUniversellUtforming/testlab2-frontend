import React from 'react';
import { Link } from 'react-router-dom';

import appRoutes, { getFullPath } from '../../common/appRoutes';

const SakList = () => {
  const createSakPath = getFullPath(appRoutes.SAK_CREATE);

  return (
    <Link to={createSakPath} relative="route">
      Ny sak
    </Link>
  );
};

export default SakList;
