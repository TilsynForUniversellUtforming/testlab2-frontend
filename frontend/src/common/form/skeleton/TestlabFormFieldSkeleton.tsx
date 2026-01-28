import './testlab-form-skeleton.scss';

import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import Skeleton from 'react-loading-skeleton';

type Props<T extends object> = TestlabInputBaseProps<T>  &{
  width?: number;
  height?: number;
  description?: string;
}

const TestlabFormFieldSkeleton = <T extends object>({
  label,
  description,
  name,
  required = false,
  width,
  height = 35,
}: Props<T>) => (
  <div className="testlab-form__input">
    <label htmlFor={name} className="testlab-form__input-label">
      {label}
      {required && <span className="asterisk-color">*</span>}
      {description && (
        <div className="testlab-form__input-sub-label">{description}</div>
      )}
    </label>
    <div id={name}>
      <Skeleton
        height={height}
        width={width}
        className="skeleton-input-field"
      />
    </div>
  </div>
);

export default TestlabFormFieldSkeleton;
