import './app-title.scss';

export interface AppTitleProps {
  title: string;
  subTitle?: string;
}

const AppTitle = ({ title, subTitle }: AppTitleProps) => (
  <div className="app-title">
    <h2 className="p-0">{title}</h2>
    {subTitle && <div className="text-muted">{subTitle}</div>}
  </div>
);

export default AppTitle;
