import './status-icon.scss';

import {
  CheckmarkIcon,
  ExclamationmarkTriangleIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import classNames from 'classnames';
import React from 'react';

export interface Props {
  finished?: boolean;
  error?: boolean;
}

const Icon = ({ finished, error }: Props) => {
  if (error) {
    return (
      <ExclamationmarkTriangleIcon
        color={'var(--colors-red-600)'}
        fontSize="1.5rem"
      />
    );
  } else if (finished) {
    return (
      <CheckmarkIcon color={'var(--colors-green-700)'} fontSize="1.5rem" />
    );
  } else {
    return <XMarkIcon color={'var(--colors-grey-600)'} fontSize="1.5rem" />;
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
