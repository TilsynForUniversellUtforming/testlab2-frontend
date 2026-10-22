import { memo } from 'react';
import styles from './loeysing-test.module.css';
import { Col } from 'react-bootstrap';

const LoeysingRightLeftColumn = () => {
  return (
    <Col as={"aside"} className={styles.loeysingTestRightColumn}>
      <h1>Right Column</h1>
    </Col>
  );
};

export default memo(LoeysingRightLeftColumn);