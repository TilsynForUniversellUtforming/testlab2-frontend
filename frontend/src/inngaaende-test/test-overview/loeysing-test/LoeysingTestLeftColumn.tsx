import { memo } from 'react';
import styles from './loeysing-test.module.css';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { PageType } from '@test/types';
import { Col, Row } from 'react-bootstrap';
import TestregelButtonList, {
  TestregelButtonListProps,
} from '@test/testregel-form/TestregelButtonList';


const LoeysingTestLeftColumn = ({
  sideutval,
  innhaldstype,
  testregeButtonListProps,
}: LeftColumFilterProps) => {
  return (
    <Col as={'aside'} className={styles.loeysingTestLeftColumn}>
      <h1>Left Column</h1>
      <Row className={styles.leftColumnRow}>
        <PageTypeSelector
          sideutvalList={sideutval.list}
          sideutvalId={sideutval.selected.sideId}
          onChangeSideutval={sideutval.onChange}
          innhaldstypeList={innhaldstype.list}
          innhaldstypeId={innhaldstype.selected.id}
          onChangeType={innhaldstype.onChange}
        />
      </Row>
      <Row className={styles.leftColumnRow}>
        <TestregelButtonList
          {...testregeButtonListProps}
        />
      </Row>
    </Col>
  );
};

export interface SideutvalProps {
  list: PageType[];
  selected: PageType;
  onChange: (sideutvalId: number) => void;
}

export interface InnhaldstypeProps {
  list: InnhaldstypeTesting[];
  selected: InnhaldstypeTesting;
  onChange: (innhaldstypeId: number) => void;
}

export interface LeftColumFilterProps {
  sideutval: SideutvalProps;
  innhaldstype: InnhaldstypeProps;
  testregeButtonListProps: TestregelButtonListProps;
}



export default memo(LoeysingTestLeftColumn);