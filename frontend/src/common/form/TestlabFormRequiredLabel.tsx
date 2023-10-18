export interface Props {
  label: string;
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
