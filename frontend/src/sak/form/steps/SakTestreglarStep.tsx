import React from 'react';
import { useForm } from 'react-hook-form';

import TestlabForm from '../../../common/form/TestlabForm';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { Option } from '../../../common/types';
import { TestRegelsett } from '../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakFormContainer from '../SakFormContainer';

interface Props extends SakFormBaseProps {
  regelsettList: TestRegelsett[];
  onClickBack: () => void;
}

const SakTestreglarStep = ({
  regelsettList,
  heading,
  subHeading,
  onClickBack,
  onSubmit,
  maalingFormState,
}: Props) => {
  const regelsettOptions: Option[] = regelsettList.map((rs) => ({
    label: rs.namn,
    value: String(rs.id),
  }));

  const formMethods = useForm<SakFormState>({
    defaultValues: {
      navn: maalingFormState.navn,
      loeysingList: maalingFormState.loeysingList,
      regelsett: regelsettList[0],
    },
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Middle',
    onClickBack: onClickBack,
  };

  return (
    <SakFormContainer
      heading={heading}
      subHeading={subHeading}
      formMethods={formMethods}
      onSubmit={onSubmit}
      buttonStep={buttonStep}
    >
      <TestlabForm.FormSelect<TestRegelsett>
        label="Testreglar"
        name="id"
        formValidation={{
          errorMessage: 'Testreglar må veljast',
          validation: { required: true, minLength: 1 },
        }}
        options={regelsettOptions}
      />
    </SakFormContainer>
  );
};

export default SakTestreglarStep;
