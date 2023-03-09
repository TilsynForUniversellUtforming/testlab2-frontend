import classNames from 'classnames';
import { Badge } from 'react-bootstrap';

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
    <Badge
      bg={classNames(
        { primary: label === levels?.primary || levels?.isPrimary },
        { danger: label === levels?.danger || levels?.isDanger },
        { success: label === levels?.success || levels?.isSuccess },
        'secondary'
      )}
    >
      {sanitizedLabel}
    </Badge>
  );
};

export default StatusBadge;
