import './testregel-button.scss';

import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Paragraph } from '@digdir/designsystemet-react';
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
  <li
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
      title={`${testregel.krav} ${testregel.name}`}
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
      <Paragraph className="testregel-button-name">{testregel.name}</Paragraph>
    </button>
    <TestregelStatusDropdown
      status={status}
      onChangeStatus={onChangeStatus}
      testregelId={testregel.id}
    />
  </li>
);

export default TestregelButton;
