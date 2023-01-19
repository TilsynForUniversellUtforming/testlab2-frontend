import './app-title.scss';

import classNames from 'classnames';

export interface AppTitleProps {
  title: string;
  overview?: boolean;
}

const AppTitle = ({ title, overview = false }: AppTitleProps) => (
  <h1 className={classNames('app-title', { overview: overview })}>{title}</h1>
);

export default AppTitle;
