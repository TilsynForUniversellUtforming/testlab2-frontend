import { memo } from 'react';
import { Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';
import styles from './loeysing-test.module.css';

export interface Props {
  title: string;
  currentLoeysingName: string;
}

const LoeysingTestHeading = ({
  title,
  currentLoeysingName,
  }: Props) => {
  const {
    loeysingId,
    testgrunnlagId
  } = useTestSession();

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
        <Tag data-color="warning">loeysingId: {loeysingId}</Tag>
      </div>
    </div>
  );
};

export default memo(LoeysingTestHeading);
