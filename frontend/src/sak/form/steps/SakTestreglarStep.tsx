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
    defaultValues: maalingFormState,
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
      <div className="sak-testreglar">
        <TestlabForm.FormSelect<SakFormState>
          label="Testreglar"
          name="regelsettId"
          formValidation={{
            errorMessage: 'Testreglar må veljast',
            validation: { required: true, min: '1' },
          }}
          options={regelsettOptions}
        />
      </div>
    </SakFormContainer>
  );
};

export default SakTestreglarStep;
