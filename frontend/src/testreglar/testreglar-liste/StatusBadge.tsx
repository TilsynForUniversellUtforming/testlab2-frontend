import classNames from 'classnames';
import { Badge } from 'react-bootstrap';

interface Props {
  tittel: string;
}

const StatusBadge = ({ tittel }: Props) => {
  return (
    <Badge
      bg={classNames(
        { primary: tittel === 'Publisert' },
        { danger: tittel === 'Utgår' },
        { success: tittel === 'Klar for testing' },
        'secondary'
      )}
    >
      {tittel}
    </Badge>
  );
};

export default StatusBadge;
