import classNames from 'classnames';
import { Badge } from 'react-bootstrap';

export type Levels = {
  primary: string;
  danger: string;
  success: string;
};

interface Props {
  title: string;
  levels: Levels;
}

const StatusBadge = ({ title, levels }: Props) => {
  const label = title ? title : 'Ingen';
  return (
    <Badge
      bg={classNames(
        { primary: title === levels.primary },
        { danger: title === levels.danger },
        { success: title === levels.success },
        'secondary'
      )}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;
