import './app-title.scss';

import { isNotDefined } from '@common/util/util';
import { Heading, Paragraph } from '@digdir/design-system-react';
import { Link } from 'react-router-dom';

export type AppTitleSize =
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
  size?: AppTitleSize;
  loading?: boolean;
}

const SubHeading = ({ subHeading, linkPath }: SubHeadingProps) => {
  if (!subHeading) {
    return null;
  }

  if (linkPath) {
    return (
      <Link to={linkPath}>
        <Paragraph spacing>{subHeading}</Paragraph>
      </Link>
    );
  } else {
    return <Paragraph spacing>{subHeading}</Paragraph>;
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
  const appSubHeading = loading ? undefined : subHeading;

  return (
    <div className="app-title">
      <Heading
        className="app-title__heading"
        size={size ?? 'xlarge'}
        spacing={!appSubHeading}
      >
        {appHeading}
      </Heading>
      <SubHeading subHeading={appSubHeading} linkPath={linkPath} />
    </div>
  );
};

export default AppTitle;
