import { memo } from 'react';
import styles from './loeysing-test.module.css';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { PageType } from '@test/types';

const LoeysingTestLeftColumn = ({
  title,
  currentLoeysingName,
  sideutvalList,
  sideutval,
  onChangeSideutval,
  innhaldstype,
  onChangeInnhaldstype,
  innhaldstypeList,
  testgrunnlagId,
  currentLoeysingId,
}: Props) => {
  return (
    <aside className={styles.loeysingTestLeftColumn}>
      <h1>Left Column</h1>
      <PageTypeSelector
        sideutvalList={sideutvalList}
        sideutvalId={sideutval.sideId}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstypeId={innhaldstype.id}
        onChangeType={onChangeInnhaldstype}
      />
    </aside>
  );
};

export interface Props {
  title: string;
  currentLoeysingName: string;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalList: PageType[];
  sideutval: PageType;
  onChangeSideutval: (sideutvalId: number) => void;
  innhaldstype: InnhaldstypeTesting;
  onChangeInnhaldstype: (innhaldstypeId: number) => void;
  testgrunnlagId: number;
  currentLoeysingId?: number;
  currentSideutvalId?: number;
}


export default memo(LoeysingTestLeftColumn);