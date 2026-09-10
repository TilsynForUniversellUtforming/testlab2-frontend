import { AppRoute, idPath } from '@common/util/routeUtils';
import loeysingImg from '../assets/loeysingar.svg';
import { Outlet, RouteObject } from 'react-router';
import { UtvalList } from '@utval/UtvalList';
import { fetchUtvalList, getUtvalById } from '@utval/utval-api';
import { Utval } from '@utval/types';
import { UtvalEdit } from './UtvalEdit';

export const UTVAL_ROOT: AppRoute = {
  navn: 'Utval',
  path: 'utval',
  imgSrc: loeysingImg,
};

export const UTVAL_EDIT: AppRoute = {
  navn: 'Endre utval',
  path: idPath,
  parentRoute: UTVAL_ROOT,
};

export const UtvalRoutes: RouteObject = {
  path: UTVAL_ROOT.path,
  element: <Outlet />,
  handle: { name: UTVAL_ROOT.navn },
  children: [
    {
      index: true,
      element: <UtvalList />,
      loader: async (): Promise<Utval[]> => {
        return await fetchUtvalList();
      },
    },
    {
      path: UTVAL_EDIT.path,
      element: <UtvalEdit />,
      handle: { name: 'Utval Edit' },
      loader: async ({params}): Promise<Utval> => {
        return await getUtvalById(Number(params?.id));
      },
    },
  ],
};
