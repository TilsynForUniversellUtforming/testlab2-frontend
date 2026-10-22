import { memo } from 'react';
import styles from './loeysing-test.module.css';

const LoeysingRightLeftColumn = () => {
  return (
    <aside className={styles.loeysingTestRightColumn}>
      <h1>Right Column</h1>
    </aside>
  );
};

export default memo(LoeysingRightLeftColumn);