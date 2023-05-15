import './status-badge.scss';

import classNames from 'classnames';

export type Levels = {
  primary: string[];
  danger: string[];
  success: string[];
};

interface Props {
  label?: any;
  levels: Levels;
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
        { primary: levels.primary.includes(label) },
        { danger: levels.danger.includes(label) },
        { success: levels.success.includes(label) }
      )}
    >
      {sanitizedLabel}
    </div>
  );
};

export default StatusBadge;
