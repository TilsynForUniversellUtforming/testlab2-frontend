import { ROOT } from '../../AppRoutes';

export const createPath = 'ny';
export const idPath = ':id';
export const editPath = 'endre';
export const listPath = 'liste';

export type AppRoute = {
  navn: string;
  path: string;
  imgSrc?: string;
  parentRoute?: AppRoute;
  disabled?: boolean;
};

export type IdReplacement = {
  id: string;
  pathParam: string;
};

export const getFullPath = (
  route: AppRoute,
  ...ids: IdReplacement[]
): string => {
  if (route === ROOT) {
    return '..';
  }

  let path = getPathFromRoot(route);

  if (ids) {
    for (const { id, pathParam } of ids) {
      path = path.replace(pathParam, id);
    }
  }

  return `/${path}`;
};

const getPathFromRoot = (route: AppRoute): string => {
  if (route.parentRoute) {
    return [getPathFromRoot(route.parentRoute), route.path].join('/');
  } else {
    return route.path;
  }
};
