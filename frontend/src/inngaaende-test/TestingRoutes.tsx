import { AppRoute } from '@common/util/routeUtils';
import { RouteObject } from 'react-router-dom';

import nyTestImg from '../assets/ny_test.svg';
import TestingApp from './TestingApp';

export const NY_TEST_ROOT: AppRoute = {
  navn: 'Ny test',
  path: 'test/:id',
  imgSrc: nyTestImg,
};

export const TestingRoutes: RouteObject = {
  path: NY_TEST_ROOT.path,
  handle: { name: NY_TEST_ROOT.navn },
  element: <TestingApp />,
};
