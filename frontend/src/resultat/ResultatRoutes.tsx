import { AppRoute, idPath } from '@common/util/routeUtils';
import ResultListApp from '@resultat/list/ResultListApp';
import ViolationsList from '@resultat/ViolationsList';
import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import resultatImg from '../assets/resultat.svg';
import {
  fetchDetaljertResultat,
  fetchResultList,
  fetchTestresultatAggregert,
} from './resultat-api';
import TestResultatApp from './TestResultatApp';

export const RESULTAT_ROOT: AppRoute = {
  navn: 'Resultat',
  path: 'resultat',
  imgSrc: resultatImg,
};

export const TESTRESULTAT_TESTGRUNNLAG: AppRoute = {
  navn: 'Resultat testgrunnlag',
  path: idPath,
  parentRoute: RESULTAT_ROOT,
};

export const VIOLATION_LIST: AppRoute = {
  navn: 'Resultat testregel',
  path: ':testregelId/:loeysingId',
  parentRoute: TESTRESULTAT_TESTGRUNNLAG,
};

export const ResultRoutes: RouteObject = {
  path: RESULTAT_ROOT.path,
  element: <Outlet />,
  handle: { name: RESULTAT_ROOT.navn },
  children: [
    {
      index: true,
      loader: fetchResultList,
      element: <ResultListApp />,
    },
    {
      path: TESTRESULTAT_TESTGRUNNLAG.path,
      element: <Outlet />,
      handle: { name: TESTRESULTAT_TESTGRUNNLAG.navn },
      children: [
        {
          index: true,
          loader: ({ params }) =>
            fetchTestresultatAggregert(parseInt(params.id as string)),
          element: <TestResultatApp />,
        },
        {
          path: VIOLATION_LIST.path,
          loader: ({ params }) =>
            fetchDetaljertResultat(
              parseInt(params.id as string),
              params.testregelId as string,
              parseInt(params.loeysingId as string)
            ),
          element: <ViolationsList />,
          handle: { name: VIOLATION_LIST.navn },
        },
      ],
    },
  ],
};
