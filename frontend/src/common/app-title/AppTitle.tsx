import './app-title.scss';

import { Link } from 'react-router-dom';

interface SubHeadingProps {
  subHeading?: string;
  linkPath?: string;
}

export interface AppTitleProps extends SubHeadingProps {
  heading?: string;
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

const AppTitle = ({ heading, subHeading, linkPath }: AppTitleProps) => (
  <div className="app-title">
    <h2 className="app-title__heading">{heading ?? 'Laster...'}</h2>
    <SubHeading subHeading={subHeading} linkPath={linkPath} />
  </div>
);

export default AppTitle;
