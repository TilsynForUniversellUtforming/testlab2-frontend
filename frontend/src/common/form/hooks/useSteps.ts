import { useNavigate } from 'react-router-dom';

import { Step } from '../TestlabForm';

const useDefaultSubmitStep = () => {
  const navigate = useNavigate();
  const onClickBack = () => navigate('..');

  const step: Step = {
    stepType: 'Submit',
    onClickBack: onClickBack,
  };

  return step;
};

export const useDefaultStartStep = (cancelPath: string) => {
  const navigate = useNavigate();
  const onClickBack = () => navigate(cancelPath);

  const step: Step = {
    stepType: 'Start',
    onClickBack: onClickBack,
  };

  return step;
};

export const useDefaultMiddleStep = (backPath: string) => {
  const navigate = useNavigate();
  const onClickBack = () => navigate(backPath);

  const step: Step = {
    stepType: 'Start',
    onClickBack: onClickBack,
  };

  return step;
};

export default useDefaultSubmitStep;
