import './app-title.scss';

import { isNotDefined } from '@common/util/util';
import { Heading } from '@digdir/design-system-react';
import { Link } from 'react-router-dom';

export type size =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

interface SubHeadingProps {
  subHeading?: string;
  linkPath?: string;
}

export interface AppTitleProps extends SubHeadingProps {
  heading?: string;
  size?: size;
  loading?: boolean;
}

const SubHeading = ({ subHeading, linkPath }: SubHeadingProps) => {
  if (!subHeading) {
    return null;
  }

  if (linkPath) {
    return (
      <Link to={linkPath}>
        <div className="app-title__sub-heading">{subHeading}</div>
      </Link>
    );
  } else {
    return <div className="app-title__sub-heading">{subHeading}</div>;
  }
};

const AppTitle = ({
  heading,
  size,
  subHeading,
  linkPath,
  loading,
}: AppTitleProps) => {
  const appHeading = loading || isNotDefined(heading) ? 'Laster...' : heading;

  return (
    <div className="app-title">
      <Heading className="app-title__heading" size={size ?? 'xlarge'}>
        {appHeading}
      </Heading>
      <SubHeading subHeading={subHeading} linkPath={linkPath} />
    </div>
  );
};

export default AppTitle;
