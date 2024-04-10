import { AppRoute, idPath } from '@common/util/routeUtils';
import VerksemdList from '@verksemder/list/VerksemdList';
import VerksemdEdit from '@verksemder/VerksemdEdit';
import VerksemderApp from '@verksemder/VerksemderApp';
import React from 'react';
import { RouteObject } from 'react-router-dom';

import verksemderImg from '../assets/verksemder.svg';

export const VERKSEMD_LIST: AppRoute = {
  navn: 'Verksemder',
  path: 'verksemder',
  imgSrc: verksemderImg,
};

export const VERKSEMD_EDIT: AppRoute = {
  navn: 'Endre verksemd',
  path: idPath,
  parentRoute: VERKSEMD_LIST,
};

export const VerksemdRoutes: RouteObject = {
  path: VERKSEMD_LIST.path,
  element: <VerksemderApp />,
  handle: { name: VERKSEMD_LIST.navn },
  children: [
    {
      index: true,
      element: <VerksemdList />,
    },
    {
      path: idPath,
      element: <VerksemdEdit />,
      handle: { name: VERKSEMD_EDIT.navn },
    },
  ],
};
