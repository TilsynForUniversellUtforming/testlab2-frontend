import { AppRoute, createPath, idPath } from '@common/util/routeUtils';
import { fetchLoeysingFormElement } from '@loeysingar/api/loeysing-api';
import { LoeysingFormElement } from '@loeysingar/api/types';
import LoeysingList from '@loeysingar/list/LoeysingList';
import LoeysingApp from '@loeysingar/LoeysingApp';
import LoeysingCreate from '@loeysingar/LoeysingCreate';
import LoeysingEdit from '@loeysingar/LoeysingEdit';
import { RouteObject } from 'react-router-dom';

import loeysingImg from '../assets/loeysingar.svg';

export const LOEYSING_ROOT: AppRoute = {
  navn: 'Løysingar',
  path: 'loeysingar',
  imgSrc: loeysingImg,
};

export const LOEYSING_CREATE: AppRoute = {
  navn: 'Ny løysing',
  path: createPath,
  parentRoute: LOEYSING_ROOT,
};
export const LOEYSING_EDIT: AppRoute = {
  navn: 'Endre løysing',
  path: idPath,
  parentRoute: LOEYSING_ROOT,
};

export const LoeysingRoutes: RouteObject = {
  path: LOEYSING_ROOT.path,
  element: <LoeysingApp />,
  handle: { name: LOEYSING_ROOT.navn },
  children: [
    {
      index: true,
      element: <LoeysingList />,
    },
    {
      path: createPath,
      element: <LoeysingCreate />,
      handle: { name: LOEYSING_CREATE.navn },
    },
    {
      path: idPath,
      element: <LoeysingEdit />,
      handle: { name: LOEYSING_EDIT.navn },
      loader: async ({ params }): Promise<LoeysingFormElement> => {
        return await fetchLoeysingFormElement(Number(params?.id));
      },
    },
  ],
};
