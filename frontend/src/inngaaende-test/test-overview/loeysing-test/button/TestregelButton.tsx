import './testregel-button.scss';

import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Paragraph } from '@digdir/design-system-react';
import TestregelStatusDropdown from '@test/test-overview/loeysing-test/button/TestregelStatusDropdown';
import {
  ButtonStatus,
  ManuellTestStatus,
  TestregelOverviewElement,
} from '@test/types';
import classnames from 'classnames';

export interface Props {
  testregel: TestregelOverviewElement;
  isActive: boolean;
  onClick: (testregelId: number) => void;
  status: ButtonStatus;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
}

const TestregelButton = ({
  onClick,
  testregel,
  isActive,
  status,
  onChangeStatus,
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
        onClick(testregel.id);
      }}
    >
      <div className="testregel-button-id">
        <div className="id-text-wrapper">
          <div className="krav">{testregel.krav}</div>
          {(status !== 'ikkje-starta' || isActive) && (
            <div className="status">
              {isActive ? 'Aktiv' : sanitizeEnumLabel(status)}
            </div>
          )}
        </div>
      </div>
      <div className="testregel-button-name">
        <Paragraph>{testregel.name}</Paragraph>
      </div>
    </button>
    <TestregelStatusDropdown
      onChangeStatus={onChangeStatus}
      testregelId={testregel.id}
    />
  </div>
);

export default TestregelButton;
