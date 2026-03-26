import './testlab-divider.scss';

import { Divider } from '@digdir/designsystemet-react';
import classnames from 'classnames';
import { Size } from '@digdir/designsystemet-types';

interface Props {
  size?: Size;
}

const TestlabDivider = ({ size = 'md' }: Props) => (
  <Divider
    color="subtle"
    className={classnames('testlab-divider', { [size]: size })}
  />
);

export default TestlabDivider;
