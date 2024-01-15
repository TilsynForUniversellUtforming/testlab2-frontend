import './testregel-button.scss';

import { Paragraph } from '@digdir/design-system-react';
import { TestregelOverviewElement } from '@test/types';
import classnames from 'classnames';

export interface Props {
  testregel: TestregelOverviewElement;
  isActive: boolean;
  onChangeTestregel: (testregelId: number) => void;
  status: string;
}

const TestregelButton = ({
  onChangeTestregel,
  testregel,
  isActive,
  status,
}: Props) => (
  <div
    className={classnames('testregel-button-wrapper', {
      active: isActive,
    })}
  >
    <button
      className={classnames('testregel-button', {
        active: isActive,
        [status]: status,
      })}
      onClick={() => {
        onChangeTestregel(testregel.id);
      }}
    >
      <div className="testregel-button-id">{testregel.krav}</div>
      <div className="testregel-button-name">
        <Paragraph size="xsmall">{testregel.name}</Paragraph>
      </div>
    </button>
  </div>
);

export default TestregelButton;
