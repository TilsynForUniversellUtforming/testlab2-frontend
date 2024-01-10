import { TestregelOverviewElement } from '@test/types';
import classnames from 'classnames';

export interface Props {
  testregel: TestregelOverviewElement;
  isActive: boolean;
  onChangeTestregel: (testregelId: number) => void;
}

const TestregelButton = ({ onChangeTestregel, testregel, isActive }: Props) => (
  <button
    className={classnames('testregel-button', { active: isActive })}
    onClick={() => {
      onChangeTestregel(testregel.id);
    }}
  >
    <div className="testregel-button-id">Nett-{testregel.id}</div>
    <div className="testregel-button-name">{testregel.name}</div>
  </button>
);

export default TestregelButton;
