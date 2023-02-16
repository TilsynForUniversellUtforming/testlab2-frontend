import classNames from 'classnames';
import { Badge } from 'react-bootstrap';

export type Levels = {
  primary: string;
  danger: string;
  success: string;
};

interface Props {
  label?: any;
  levels: Levels;
}

const StatusBadge = ({ label, levels }: Props) => {
  if (label == null || typeof label === 'undefined') {
    return null;
  }

  return (
    <Badge
      bg={classNames(
        { primary: label === levels.primary },
        { danger: label === levels.danger },
        { success: label === levels.success },
        'secondary'
      )}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;
