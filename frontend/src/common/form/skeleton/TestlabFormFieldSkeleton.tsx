import { EditProps } from '@common/form/TestlabFormInput';
import Skeleton from 'react-loading-skeleton';

interface Props<T extends object> extends EditProps<T> {
  width?: number;
  height?: number;
}

const TestlabFormFieldSkeleton = <T extends object>({
  label,
  sublabel,
  name,
  required = false,
  width = 145,
  height = 35,
}: Props<T>) => (
  <div className="testlab-form__input">
    <label htmlFor={name} className="testlab-form__input-label">
      {label}
      {required && <span className="asterisk-color">*</span>}
      {sublabel && (
        <div className="testlab-form__input-sub-label">{sublabel}</div>
      )}
    </label>
    <div id={name}>
      <Skeleton height={height} width={width} />
    </div>
  </div>
);

export default TestlabFormFieldSkeleton;
