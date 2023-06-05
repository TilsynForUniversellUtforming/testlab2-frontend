import { ButtonColor } from '@digdir/design-system-react';
import React from 'react';

import appRoutes from '../../common/appRoutes';
import TestlabLinkButton from '../../common/button/TestlabLinkButton';

const SakList = () => (
  <TestlabLinkButton
    title={'+ Legg til sak'}
    route={appRoutes.SAK_CREATE}
    color={ButtonColor.Success}
  />
);

export default SakList;
