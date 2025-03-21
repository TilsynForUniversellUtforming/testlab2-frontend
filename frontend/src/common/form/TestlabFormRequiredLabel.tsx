import { ReactNode } from 'react';

export interface Props {
  label: ReactNode;
  required: boolean;
}

interface LabelProps extends Props {
  htmlFor: string;
  description?: ReactNode;
}

/**
 * Displays a label for an input field, it adds an asterisk next to the label if the field is marked as required.
 *
 * @param {Props} props - The props for the component.
 * @param {ReactNode} props.label - The label text or element for the input field.
 * @param {boolean} props.required - Indicates whether the input field is required. If true, an asterisk is displayed next to the label.
 *
 * @returns {ReactNode} The label element, optionally including an asterisk for required fields.
 */
const TestlabFormRequiredLabel = ({ label, required }: Props): ReactNode => {
  return (
    <>
      {label}
      {required && <span className="asterisk-color">*</span>}
    </>
  );
};

export const TestlabFormLabel = ({
  label,
  description,
  required,
  htmlFor,
}: LabelProps) => (
  <label htmlFor={htmlFor} className="testlab-form__input-label">
    <TestlabFormRequiredLabel label={label} required={required} />
    {description && (
      <div className="testlab-form__input-sub-label">{description}</div>
    )}
  </label>
);

export default TestlabFormRequiredLabel;
