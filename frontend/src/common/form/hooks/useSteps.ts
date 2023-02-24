import { useNavigate } from 'react-router-dom';

import { Step } from '../TestlabFormButtons';

const useDefaultSubmitStep = () => {
  const navigate = useNavigate();
  const onClickBack = () => navigate('..');

  const step: Step = {
    stepType: 'Submit',
    onClickBack: onClickBack,
  };

  return step;
};

export const useDefaultStartStep = () => {
  const navigate = useNavigate();
  const onClickBack = () => navigate('..');

  const step: Step = {
    stepType: 'Start',
    onClickBack: onClickBack,
  };

  return step;
};

export const useDefaultMiddleStep = () => {
  const navigate = useNavigate();
  const onClickBack = () => navigate(-1);

  const step: Step = {
    stepType: 'Start',
    onClickBack: onClickBack,
  };

  return step;
};

export default useDefaultSubmitStep;
