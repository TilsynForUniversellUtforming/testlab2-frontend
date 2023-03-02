import { ReactElement } from 'react';
import { RouteObject } from 'react-router-dom';

import { createPath, editPath, idPath, listPath } from '../appRoutes';

export interface Props {
  rootPath: string;
  rootElement: ReactElement;
  listElement?: ReactElement;
  createElement?: ReactElement;
  element?: ReactElement;
  editElement?: ReactElement;
}

const useRoutes = ({
  rootPath,
  rootElement,
  listElement,
  createElement,
  element,
  editElement,
}: Props): RouteObject => {
  const rootChildren: RouteObject[] = [];
  if (listElement) {
    rootChildren.push({
      path: listPath,
      element: listElement,
    });
  }

  if (createElement) {
    rootChildren.push({
      path: createPath,
      element: createElement,
    });
  }

  if (element) {
    if (editElement) {
      rootChildren.push({
        path: idPath,
        element: element,
        children: [
          {
            path: editPath,
            element: editElement,
          },
        ],
      });
    } else {
      rootChildren.push({
        path: idPath,
        element: element,
      });
    }
  }

  return {
    path: rootPath,
    element: rootElement,
    children: rootChildren,
  };
};

export default useRoutes;
