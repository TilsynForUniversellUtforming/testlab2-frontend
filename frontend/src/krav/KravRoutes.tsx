import { AppRoute, idPath } from '@common/util/routeUtils';
import { Outlet, RouteObject } from 'react-router-dom';

import kravImg from '../assets/krav.svg';
import { getKrav, listKrav } from './api/krav-api';
import KravApp from './KravApp';
import KravEditApp from './KravEditApp';
import { Krav } from './types';

export const KRAV_LIST: AppRoute = {
  navn: 'Krav',
  path: 'krav',
  imgSrc: kravImg,
  disabled: false,
};

export const KRAV_EDIT: AppRoute = {
  navn: 'Endre krav',
  path: idPath,
  parentRoute: KRAV_LIST,
};

export const KravRoutes: RouteObject = {
  path: KRAV_LIST.path,
  handle: { name: KRAV_LIST.navn },
  loader: async (): Promise<Krav[]> => {
    return await listKrav();
  },
  element: <Outlet />,
  children: [
    {
      index: true,
      loader: async (): Promise<Krav[]> => {
        return await listKrav();
      },
      element: <KravApp />,
    },
    {
      path: idPath,
      loader: async ({ params }): Promise<Krav> => {
        return (await getKrav(Number(params?.id))) as Krav;
      },
      handle: { name: KRAV_EDIT.navn },
      element: <KravEditApp />,
    },
  ],
};
