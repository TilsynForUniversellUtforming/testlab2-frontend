import styles from './testregel-button.module.scss';

import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Paragraph } from '@digdir/designsystemet-react';
import TestregelStatusDropdown from '@test/test-overview/loeysing-test/button/TestregelStatusDropdown';
import {
  ButtonStatus,
  ManuellTestStatus,
  TestregelOverviewElement,
} from '@test/types';
import classnames from 'classnames';
import { memo } from 'react';
import TestregelUtfallButton from '@test/test-overview/loeysing-test/button/TestregelUtfallButton';
import { ElementResultat } from '@test/api/types';

export interface Props {
  testregel: TestregelOverviewElement;
  isActive: boolean;
  onClick: (testregelId: number) => void;
  status: ButtonStatus;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  onSetSideUtfall: (status: ElementResultat, testregelId: number) => void;
}

const TestregelButton = memo(
  ({
    onClick,
    testregel,
    isActive,
    status,
    onChangeStatus,
    onSetSideUtfall,
  }: Props) => {
    return (
      <div
        className={classnames(styles.testregelButtonWrapper, {
          [styles.active]: isActive,
        })}
      >
        <button
          className={classnames(
            styles.testregelButton,
            isActive && styles.active,
            status !== 'ikkje-starta' && styles[status]
          )}
          onClick={() => onClick(testregel.id)}
          title={`${testregel.krav} ${testregel.name}`}
        >
          <div className={styles.testregelButtonId}>
            <div className={styles.idTextWrapper}>
              <div className="krav">
                {testregel.krav} id: {testregel.id}
              </div>
              {(status !== 'ikkje-starta' || isActive) && (
                <div className={styles.status}>
                  {isActive ? 'Aktiv' : sanitizeEnumLabel(status)}
                </div>
              )}
            </div>
          </div>
          <Paragraph className={styles.testregelButtonName}>
            {testregel.name}
          </Paragraph>
        </button>
        <div className={styles.statusDropdowns}>
          <TestregelStatusDropdown
            status={status}
            onChangeStatus={onChangeStatus}
            testregelId={testregel.id}
          />
          <TestregelUtfallButton
            status={status}
            onChangeStatus={onSetSideUtfall}
            testregelId={testregel.id}
          />
        </div>
      </div>
    );
  }
);

export default TestregelButton;
