import './app-title.scss';

import classNames from 'classnames';

export interface AppTitleProps {
  title: string;
  overview?: boolean;
}

const AppTitle = ({ title, overview = false }: AppTitleProps) => (
  <h2 className={classNames('app-title', { overview: overview })}>{title}</h2>
);

export default AppTitle;
