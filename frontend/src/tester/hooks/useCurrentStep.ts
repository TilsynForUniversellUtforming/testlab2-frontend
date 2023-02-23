import { useLocation, useParams } from 'react-router-dom';

import { StepRoute, testing_steps } from '../../common/appRoutes';

export type StepRouteActive = StepRoute & {
  active: boolean;
};

const useCurrentStep = (): StepRouteActive[] => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const fixedPath = pathname.replace(String(id), ':id').replace(/\/$/g, '');
  const activeStep = testing_steps.find((sr) =>
    fixedPath.endsWith(sr.route.path)
  )?.step;

  return testing_steps.map((sr) => ({
    ...sr,
    active: sr.step <= (activeStep ?? 0),
  }));
};

export default useCurrentStep;
