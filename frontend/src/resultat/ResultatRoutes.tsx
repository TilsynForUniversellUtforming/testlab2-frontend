import { AppRoute, idPath } from '@common/util/routeUtils';
import ResultatKontrollOversikt from '@resultat/kontroll_detaljer/ResultatKontrollOversikt';
import ViolationsList from '@resultat/kontroll_loeysing/ViolationsList';
import ResultatListApp from '@resultat/list/ResultatListApp';
import ResultatListKravApp from '@resultat/list/ResultatListKravApp';
import ResultatListTemaApp from '@resultat/list/ResultListTemaApp';
import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import resultatImg from '../assets/resultat.svg';
import TestResultatApp from './kontroll_loeysing/TestResultatApp';
import {
  fetchKontrollLoeysing,
  fetchKontrollResultat,
  fetchResultatPrKrav,
  fetchResultatPrTema,
  fetchResultList,
  fetchViolationsData,
} from './resultat-api';
import ResultITSolution from '@resultat/kontroll_loeysing/ResultITSolution';

export const RESULTAT_ROOT: AppRoute = {
  navn: 'Resultat',
  path: 'resultat',
  imgSrc: resultatImg,
};

export const RESULTAT_TEMA_LIST: AppRoute = {
  navn: 'Resultat tema',
  path: 'tema',
  parentRoute: RESULTAT_ROOT,
};

export const RESULTAT_KRAV_LIST: AppRoute = {
  navn: 'Resultat krav',
  path: 'krav',
  parentRoute: RESULTAT_ROOT,
};

export const RESULTAT_KONTROLL: AppRoute = {
  navn: 'Resultat kontroll',
  path: idPath,
  parentRoute: RESULTAT_ROOT,
};

export const RESULTAT_TEMA_KONTROLL_LIST: AppRoute = {
  navn: 'Resultat tema',
  path: 'tema',
  parentRoute: RESULTAT_KONTROLL,
};

export const RESULTAT_KRAV_KONTROLL_LIST: AppRoute = {
  navn: 'Resultat krav',
  path: 'krav',
  parentRoute: RESULTAT_KONTROLL,
};

export const TESTRESULTAT_LOEYSING: AppRoute = {
  navn: 'Resultat løysing',
  path: ':loeysingId',
  parentRoute: RESULTAT_KONTROLL,
};
export const RESULTAT_TEMA_LOEYSING_LIST: AppRoute = {
  navn: 'Resultat tema',
  path: 'tema',
  parentRoute: TESTRESULTAT_LOEYSING,
};

export const RESULTAT_KRAV_LOEYSING_LIST: AppRoute = {
  navn: 'Resultat krav',
  path: 'krav',
  parentRoute: TESTRESULTAT_LOEYSING,
};

export const VIOLATION_LIST: AppRoute = {
  navn: 'Resultat testregel',
  path: ':testregelId',
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
      element: <ResultatListApp />,
    },
    {
      path: RESULTAT_TEMA_LIST.path,
      loader: ({ params }) =>
        fetchResultatPrTema(params.id as string, params.loeysingId as string),
      element: <ResultatListTemaApp />,
    },
    {
      path: RESULTAT_KRAV_LIST.path,
      loader: ({ params }) =>
        fetchResultatPrKrav(params.id as string, params.loeysingId as string),
      element: <ResultatListKravApp />,
    },
    {
      path: RESULTAT_KONTROLL.path,
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <ResultatKontrollOversikt />,
          loader: ({ params }) =>
            fetchKontrollResultat(parseInt(params.id as string)),
          handle: { name: RESULTAT_KONTROLL.navn },
        },
        {
          path: RESULTAT_TEMA_KONTROLL_LIST.path,
          loader: ({ params }) =>
            fetchResultatPrTema(
              params.id as string,
              params.loeysingId as string
            ),
          element: <ResultatListTemaApp />,
        },
        {
          path: RESULTAT_KRAV_KONTROLL_LIST.path,
          loader: ({ params }) =>
            fetchResultatPrKrav(
              params.id as string,
              params.loeysingId as string
            ),
          element: <ResultatListKravApp />,
        },
        {
          path: TESTRESULTAT_LOEYSING.path,
          element: <ResultITSolution />,
          handle: { name: TESTRESULTAT_LOEYSING.navn },
          loader: ({ params }) =>
            fetchKontrollLoeysing(
              parseInt(params.id as string),
              parseInt(params.loeysingId as string)
            ),
          children: [
            {
              index: true,
              element: <TestResultatApp />,
            },
            {
              path: RESULTAT_TEMA_LOEYSING_LIST.path,
              loader: ({ params }) =>
                fetchResultatPrTema(
                  params.id as string,
                  params.loeysingId as string
                ),
              element: <ResultatListTemaApp />,
            },
            {
              path: RESULTAT_KRAV_LOEYSING_LIST.path,
              loader: ({ params }) =>
                fetchResultatPrKrav(
                  params.id as string,
                  params.loeysingId as string
                ),
              element: <ResultatListKravApp />,
            },
            {
              path: VIOLATION_LIST.path,
              loader: ({ params }) =>
                fetchViolationsData(
                  parseInt(params.id as string),
                  parseInt(params.loeysingId as string),
                  parseInt(params.testregelId as string)
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
