import './testlab-divider.scss';

import { Size } from '@common/types';
import { Divider } from '@digdir/design-system-react';
import classnames from 'classnames';

interface Props {
  size?: Size;
}

const TestlabDivider = ({ size = 'medium' }: Props) => (
  <Divider
    color="default"
    className={classnames('testlab-divider', { [size]: size })}
  />
);

export default TestlabDivider;
