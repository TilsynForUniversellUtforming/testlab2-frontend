import './app-title.scss';

import { isNotDefined } from '@common/util/validationUtils';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Size } from '@digdir/designsystemet-types';

import { Link } from 'react-router-dom';



interface SubHeadingProps {
  subHeading?: string;
  linkPath?: string;
}

export interface AppTitleProps extends SubHeadingProps {
  heading?: string;
  size?: Size;
  loading?: boolean;
}

const SubHeading = ({ subHeading, linkPath }: SubHeadingProps) => {
  if (!subHeading) {
    return null;
  }

  if (linkPath) {
    return (
      <Link to={linkPath}>
        <Paragraph>{subHeading}</Paragraph>
      </Link>
    );
  } else {
    return <Paragraph>{subHeading}</Paragraph>;
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
        data-size={size ?? 'xl'}
      >
        {appHeading}
      </Heading>
      <SubHeading subHeading={appSubHeading} linkPath={linkPath} />
    </div>
  );
};

export default AppTitle;
