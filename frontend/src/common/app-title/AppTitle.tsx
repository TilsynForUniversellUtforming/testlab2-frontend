import './app-title.scss';

export interface AppTitleProps {
  heading: string;
  subHeading?: string;
}

const AppTitle = ({ heading, subHeading }: AppTitleProps) => (
  <div className="app-title">
    <h2 className="app-title__heading">{heading}</h2>
    {subHeading && <div className="app-title__sub-heading">{subHeading}</div>}
  </div>
);

export default AppTitle;
