import { memo } from 'react';
import styles from './loeysing-test.module.css';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { Row } from 'react-bootstrap';
import TestregelButtonList, {
  TestregelButtonListProps,
} from '@test/testregel-form/TestregelButtonList';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';


const LoeysingTestLeftColumn = ({
  sideutval,
  innhaldstypeTesting,
  testregeButtonListProps,
}: LeftColumFilterProps) => {

  const { pageType, pageTypeList, innhaldstype,  } =
    useTestSession();

  return (
    <>
      <h1>Left Column</h1>
      <Row className={styles.leftColumnRow}>
        <PageTypeSelector
          sideutvalList={pageTypeList}
          sideutvalId={pageType.sideId}
          onChangeSideutval={sideutval.onChange}
          innhaldstypeList={innhaldstypeTesting.list}
          innhaldstypeId={innhaldstype.id}
          onChangeType={innhaldstypeTesting.onChange}
        />
      </Row>
      <Row className={styles.leftColumnRow}>
        <TestregelButtonList {...testregeButtonListProps} />
      </Row>
    </>
  );
};

export interface SideutvalProps {
  onChange: (sideutvalId: number) => void;
}

export interface InnhaldstypeProps {
  list: InnhaldstypeTesting[];
  onChange: (innhaldstypeId: number) => void;
}

export interface LeftColumFilterProps {
  sideutval: SideutvalProps;
  innhaldstypeTesting: InnhaldstypeProps;
  testregeButtonListProps: TestregelButtonListProps;
}



export default memo(LoeysingTestLeftColumn);