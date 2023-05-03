import './status-icon.scss';

import { AlertTriangleIcon, CheckIcon, CloseIcon } from '@digdir/ds-icons';
import classNames from 'classnames';
import React from 'react';

export interface Props {
  finished?: boolean;
  error?: boolean;
}

const Icon = ({ finished, error }: Props) => {
  if (error) {
    return <AlertTriangleIcon color={'var(--colors-red-600)'} />;
  } else if (finished) {
    return <CheckIcon color={'var(--colors-green-700)'} />;
  } else {
    return <CloseIcon color={'var(--colors-grey-600)'} />;
  }
};

const StatusIcon = ({ finished = false, error = false }: Props) => (
  <div
    className={classNames('status-icon', { error: error, finished: finished })}
  >
    <Icon finished={finished} error={error} />
  </div>
);

export default StatusIcon;
