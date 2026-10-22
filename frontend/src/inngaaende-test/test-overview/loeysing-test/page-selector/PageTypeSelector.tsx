import type { OptionType } from '@common/types';
import { Heading } from '@digdir/designsystemet-react';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import styles from '../loeysing-test.module.css';

export interface PageTypeSelectorProps {
  sideutvalList: PageType[];
  sideutvalId: number;
  onChangeSideutval: (sideutvalId: number) => void;
  innhaldstypeList: InnhaldstypeTesting[];
  innhaldstypeId: number;
  onChangeType: (innhaldstypeId: number) => void;
}

const PageTypeSelector = ({
  sideutvalList,
  sideutvalId,
  onChangeSideutval,
  innhaldstypeList,
  innhaldstypeId,
  onChangeType,
}: PageTypeSelectorProps) => {
  const innhaldstypeOptions: OptionType[] = innhaldstypeList.map(
    ({ id, innhaldstype }) => ({
      value: String(id),
      label: innhaldstype,
    })
  );

  const sideutvalOption: OptionType[] = sideutvalList.map(
    ({ sideId, url }) => ({
      value: String(sideId),
      label: url  + " (" + sideId + ")",
    })
  );

  return (
    <div className={styles.pageSelector}>
      <Heading level={3} data-size="sm">
        Vel type test
      </Heading>
      <div className={styles.pageSelectorWrapper}>
        <TypeDropdown
          title="Innhaldstypar"
          typeId={innhaldstypeId}
          onChangeType={onChangeType}
          options={innhaldstypeOptions}
        />
        <TypeDropdown
          title="Sideutval"
          typeId={sideutvalId}
          onChangeType={onChangeSideutval}
          options={sideutvalOption}
        />
      </div>
    </div>
  );
};

export default PageTypeSelector;
