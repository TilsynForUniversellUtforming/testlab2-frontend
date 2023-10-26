import TestlabLinkButton from '@common/button/TestlabLinkButton';
import { ButtonColor } from '@common/types';
import { SAK_CREATE } from '@sak/SakRoutes';
import React from 'react';

const SakList = () => (
  <TestlabLinkButton
    title="Legg til sak"
    route={SAK_CREATE}
    color={ButtonColor.Success}
  />
);

export default SakList;
