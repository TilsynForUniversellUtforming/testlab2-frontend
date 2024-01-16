import './testregel-button.scss';

import { Paragraph } from '@digdir/design-system-react';
import { ButtonStatus, TestregelOverviewElement } from '@test/types';
import classnames from 'classnames';

export interface Props {
  testregel: TestregelOverviewElement;
  isActive: boolean;
  onChangeTestregel: (testregelId: number) => void;
  status: ButtonStatus;
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
      <div className="testregel-button-id">
        <div className="id-text-wrapper">
          <div className="krav">{testregel.krav}</div>
          {(status !== 'Ikkje starta' || isActive) && (
            <div className="status">{isActive ? 'Aktiv' : status}</div>
          )}
        </div>
      </div>
      <div className="testregel-button-name">
        <Paragraph>{testregel.name}</Paragraph>
      </div>
    </button>
  </div>
);

export default TestregelButton;
