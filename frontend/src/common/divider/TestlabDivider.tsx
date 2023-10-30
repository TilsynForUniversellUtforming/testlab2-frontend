import './testlab-divider.scss';

import { Size } from '@common/types';
import classnames from 'classnames';

interface Props {
  size?: Size;
}

const TestlabDivider = ({ size = 'medium' }: Props) => (
  <hr className={classnames('testlab-divider', { [size]: size })} />
);

export default TestlabDivider;
