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

/**
 * Gets the full path for a given route, replacing any path parameters with specified ids.
 * @param {AppRoute} route - The route to resolve the path for.
 * @param {...IdReplacement} ids - An array of ID replacements for path parameters.
 * @returns {string} The full path for the route.
 */
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

/**
 * Gets the path from the root to the given route.
 * @param {AppRoute} route - The route to resolve the path for.
 * @returns {string} The path from the root to the given route.
 */
const getPathFromRoot = (route: AppRoute): string => {
  if (route.parentRoute) {
    return [getPathFromRoot(route.parentRoute), route.path].join('/');
  } else {
    return route.path;
  }
};
