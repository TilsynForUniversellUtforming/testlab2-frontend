import './status-icon.scss';

import { CheckIcon, CloseIcon } from '@digdir/ds-icons';
import classNames from 'classnames';
import React from 'react';

export interface Props {
  finished?: boolean;
}

const StatusIcon = ({ finished = false }: Props) => (
  <div className={classNames('status-icon', { finished: finished })}>
    {finished ? (
      <CheckIcon color={'var(--colors-green-700)'} />
    ) : (
      <CloseIcon color={'var(--colors-grey-600)'} />
    )}
  </div>
);

export default StatusIcon;
