import { ReactNode } from 'react';

export interface Props {
  label: ReactNode;
  required: boolean;
}

const TestlabFormRequiredLabel = ({ label, required }: Props) => {
  return (
    <>
      {label}
      {required && <span className="asterisk-color">*</span>}
    </>
  );
};

export default TestlabFormRequiredLabel;
