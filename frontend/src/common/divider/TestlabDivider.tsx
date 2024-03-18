import './testlab-divider.scss';

import { Size } from '@common/types';
import { Divider } from '@digdir/designsystemet-react';
import classnames from 'classnames';

interface Props {
  size?: Size;
}

const TestlabDivider = ({ size = 'medium' }: Props) => (
  <Divider
    color="subtle"
    className={classnames('testlab-divider', { [size]: size })}
  />
);

export default TestlabDivider;
