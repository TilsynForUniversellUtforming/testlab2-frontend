import './page-selector.scss';

import { OptionType } from '@common/types';
import { Heading } from '@digdir/designsystemet-react';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

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
    ({ sideId, pageType }) => ({
      value: String(sideId),
      label: pageType,
    })
  );

  return (
    <div className="page-selector">
      <Heading level={3} size="small" spacing>
        Vel type test
      </Heading>
      <div className="page-selector-wrapper">
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
