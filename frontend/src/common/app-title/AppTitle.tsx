import './app-title.scss';

import classNames from 'classnames';

export interface AppTitleProps {
  title: string;
  subTitle?: string;
  overview?: boolean;
}

const AppTitle = ({ title, subTitle, overview = false }: AppTitleProps) => (
  <div className={classNames('app-title', { overview: overview })}>
    <h2 className="p-0">{title}</h2>
    {subTitle && <div className="text-muted">{subTitle}</div>}
  </div>
);

export default AppTitle;
