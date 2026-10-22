import { memo } from 'react';
import { Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import styles from './loeysing-test.module.css';

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

const LoeysingTestHeading = ({
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
    <div className={styles.manualTestHeading}>
      <Heading data-size="xl" level={2}>
        {currentLoeysingName}
      </Heading>
      <Paragraph variant={'long'}>
        {title} TestgrunnlagId:{testgrunnlagId}
      </Paragraph>
      <div className={styles.tags}>
        <Tag data-color="warning">Inngående kontroll</Tag>
        <Tag data-color="warning">Nettside</Tag>
        <Tag data-color="warning">loeysingId: {currentLoeysingId}</Tag>
      </div>
    </div>
  );
};

export default memo(LoeysingTestHeading);
