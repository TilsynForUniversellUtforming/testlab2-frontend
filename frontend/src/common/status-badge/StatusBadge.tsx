import './status-badge.scss';

import classNames from 'classnames';

export type Levels = {
  primary: string;
  danger: string;
  success: string;
  isPrimary?: boolean;
  isDanger?: boolean;
  isSuccess?: boolean;
};

interface Props {
  label?: any;
  levels?: Levels;
}

const StatusBadge = ({ label, levels }: Props) => {
  if (label == null || typeof label === 'undefined') {
    return null;
  }

  const sanitizedLabel = String(label)
    .replace('_', ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div
      className={classNames(
        'status-badge',
        { primary: label === levels?.primary || levels?.isPrimary },
        { danger: label === levels?.danger || levels?.isDanger },
        { success: label === levels?.success || levels?.isSuccess }
      )}
    >
      {sanitizedLabel}
    </div>
  );
};

export default StatusBadge;
