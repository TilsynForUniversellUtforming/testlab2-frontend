import { useMatch } from 'react-router-dom';

import { testing_steps } from '../../common/appRoutes';

export interface StepRoute {
  step: number;
  path: string;
}

const useCurrentStep = (): StepRoute | undefined => {
  const routes = testing_steps.map((route, idx) => {
    const finalPath = [];
    if (route?.parentRoute) {
      finalPath.push(route?.parentRoute.path);
    }
    finalPath.push(route.path);

    return {
      step: idx,
      path: `/${finalPath.join('/')}`,
    };
  });

  return routes.find((r) => useMatch(r.path));
};

export default useCurrentStep;
