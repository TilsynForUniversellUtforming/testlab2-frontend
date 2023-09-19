import appRoutes from '@common/appRoutes';
import TestlabLinkButton from '@common/button/TestlabLinkButton';
import { ButtonColor } from '@common/types';
import React from 'react';

const SakList = () => (
  <TestlabLinkButton
    title="Legg til sak"
    route={appRoutes.SAK_CREATE}
    color={ButtonColor.Success}
  />
);

export default SakList;
