import { AppRoute, idPath } from '@common/util/routeUtils';
import RestultatKontrollOversikt from '@resultat/kontroll_detaljer/RestultatKontrollOversikt';
import ResultListApp from '@resultat/list/ResultListApp';
import ViolationsList from '@resultat/ViolationsList';
import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import resultatImg from '../assets/resultat.svg';
import {
  fetchDetaljertResultat,
  fetchKontrollLoeysing,
  fetchKontrollResultat,
  fetchResultList,
} from './resultat-api';
import TestResultatApp from './TestResultatApp';

export const RESULTAT_ROOT: AppRoute = {
  navn: 'Resultat',
  path: 'resultat',
  imgSrc: resultatImg,
};

export const RESULTAT_KONTROLL: AppRoute = {
  navn: 'Resultat kontroll',
  path: idPath,
  parentRoute: RESULTAT_ROOT,
};

export const TESTRESULTAT_LOEYSING: AppRoute = {
  navn: 'Resultat løysing',
  path: ':loeysingId',
  parentRoute: RESULTAT_KONTROLL,
};

export const VIOLATION_LIST: AppRoute = {
  navn: 'Resultat testregel',
  path: ':kravId',
  parentRoute: TESTRESULTAT_LOEYSING,
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
      path: RESULTAT_KONTROLL.path,
      element: <Outlet />,
      handle: { name: RESULTAT_KONTROLL.navn },
      children: [
        {
          index: true,
          loader: ({ params }) =>
            fetchKontrollResultat(parseInt(params.id as string)),
          element: <RestultatKontrollOversikt />,
        },
        {
          path: TESTRESULTAT_LOEYSING.path,
          element: <Outlet />,
          handle: { name: TESTRESULTAT_LOEYSING.navn },
          children: [
            {
              index: true,
              loader: ({ params }) =>
                fetchKontrollLoeysing(
                  parseInt(params.id as string),
                  parseInt(params.loeysingId as string)
                ),
              element: <TestResultatApp />,
            },
            {
              path: VIOLATION_LIST.path,
              loader: ({ params }) =>
                fetchDetaljertResultat(
                  parseInt(params.id as string),
                  parseInt(params.loeysingId as string),
                  parseInt(params.kravId as string)
                ),
              element: <ViolationsList />,
              handle: { name: VIOLATION_LIST.navn },
            },
          ],
        },
      ],
    },
  ],
};
