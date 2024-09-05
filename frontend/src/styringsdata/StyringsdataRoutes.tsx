import { AppRoute } from '@common/util/routeUtils';
import { Outlet, redirect, RouteObject } from 'react-router-dom';

import {
  createStyringsdataKontroll,
  createStyringsdataLoeysing,
  updateStyringsdataKontroll,
  updateStyringsdataLoeysing,
} from './api/styringsdata-api';
import StyringsdataFormKontroll from './kontroll/StyringsdataFormKontroll';
import StyringsdataFormLoeysing from './loeysing/StyringsdataFormLoeysing';
import {
  styringsdataLoader,
  styringsdataLoaderKontroll,
} from './StyringsdataRoutes.loader';
import { StyringsdataKontroll, StyringsdataLoeysing } from './types';

export const STYRINGSDATA_ROOT: AppRoute = {
  navn: 'Styringsdata kontroll',
  path: 'styringsdata/:kontrollId',
  disabled: true,
};

export const STYRINGSDATA_LOEYSING: AppRoute = {
  navn: 'Styringsdata løysing',
  path: ':loeysingId',
  parentRoute: STYRINGSDATA_ROOT,
};

export const StyringsdataRoutes: RouteObject = {
  path: STYRINGSDATA_ROOT.path,
  handle: { name: STYRINGSDATA_ROOT.navn },
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <StyringsdataFormKontroll />,
      action: async ({ request }) => {
        const formData = (await request.json()) as StyringsdataKontroll;
        switch (request.method) {
          case 'POST': {
            const styringsdata = await createStyringsdataKontroll(formData);
            return redirect(`?styringsdataId=${styringsdata.id}`);
          }
          case 'PUT': {
            return await updateStyringsdataKontroll(formData);
          }
        }
      },
      loader: styringsdataLoaderKontroll,
    },
    {
      path: STYRINGSDATA_LOEYSING.path,
      element: <StyringsdataFormLoeysing />,
      handle: { name: STYRINGSDATA_LOEYSING.navn },
      action: async ({ request }) => {
        const formData = (await request.json()) as StyringsdataLoeysing;
        switch (request.method) {
          case 'POST': {
            const styringsdata = await createStyringsdataLoeysing(formData);
            return redirect(`?styringsdataId=${styringsdata.id}`);
          }
          case 'PUT': {
            return await updateStyringsdataLoeysing(formData);
          }
        }
      },
      loader: styringsdataLoader,
    },
  ],
};
