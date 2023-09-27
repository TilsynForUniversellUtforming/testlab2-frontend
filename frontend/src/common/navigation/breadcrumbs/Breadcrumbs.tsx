import './breadcrumbs.scss';

import { PathName } from '@common/app-container/types';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Link } from 'react-router-dom';

export interface Props {
  crumbs: PathName[];
}

const Breadcrumbs = ({ crumbs }: Props) => {
  if (crumbs.length < 2) {
    return null;
  }

  return (
    <div className="breadcrumbs">
      {crumbs.map(({ path, name }, i) => (
        <div className="breadcrumbs__crumb" key={`${path}_${i}`}>
          {i !== 0 && (
            <ChevronRightIcon
              fontSize="1.5rem"
              className="breadcrumbs__crumb-icon"
            />
          )}
          <span className="breadcrumbs__crumb-text">
            {i === crumbs.length - 1 ? name : <Link to={path}>{name}</Link>}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
