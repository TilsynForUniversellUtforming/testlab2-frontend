import { AppRoute, idPath } from '@common/util/routeUtils';
import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import resultatImg from '../assets/resultat.svg';
import { fetchTestresultatAggregert } from './resultat-api';
import TestResultatApp from './TestResultatApp';

export const RESULTAT_ROOT: AppRoute = {
  navn: 'Resultat',
  path: 'resultat/',
  imgSrc: resultatImg,
};

export const TESTRESULTAT_TESTGRUNNLAG: AppRoute = {
  navn: 'Resultat testgrunnlag',
  path: idPath,
  parentRoute: RESULTAT_ROOT,
};

export const ResultRoutes: RouteObject = {
  path: RESULTAT_ROOT.path,
  element: <Outlet />,
  handle: { name: RESULTAT_ROOT.navn },
  children: [
    {
      path: TESTRESULTAT_TESTGRUNNLAG.path,
      loader: ({ params }) => {
        return fetchTestresultatAggregert(parseInt(params.id as string));
      },
      element: <TestResultatApp />,
      handle: { name: TESTRESULTAT_TESTGRUNNLAG.navn },
    },
  ],
};
