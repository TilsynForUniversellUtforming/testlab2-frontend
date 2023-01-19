import './title.scss';

export interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => <h2 className="app-title">{title}</h2>;

export default Title;
