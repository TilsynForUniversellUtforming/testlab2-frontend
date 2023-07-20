import './breadcrumbs.scss';

import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Link, useMatches } from 'react-router-dom';

type Handle = {
  name: string;
};

type Breadcrumb = {
  path: string;
  breadcrumbName: string;
};

const Breadcrumbs = () => {
  const matches = useMatches();

  const crumbs: Breadcrumb[] = matches
    .filter((match) => match.handle)
    .map((match) => ({
      path: match.pathname,
      breadcrumbName: (match.handle as Handle).name,
    }));

  if (crumbs.length < 2) {
    return null;
  }

  return (
    <div className="breadcrumbs">
      {crumbs.map(({ path, breadcrumbName }, i) => (
        <div className="breadcrumbs__crumb" key={`${path}_${i}`}>
          {i !== 0 && (
            <ChevronRightIcon
              fontSize="1.5rem"
              className="breadcrumbs__crumb-icon"
            />
          )}
          <span className="breadcrumbs__crumb-text">
            {i === crumbs.length - 1 ? (
              breadcrumbName
            ) : (
              <Link to={path}>{breadcrumbName}</Link>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
