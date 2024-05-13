import './page-selector.scss';

import { OptionType } from '@common/types';
import { Heading } from '@digdir/designsystemet-react';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';

export interface PageTypeSelectorProps {
  nettsideOptions: OptionType[];
  sideId: string;
  onChangeSide: (nettsideId: string) => void;
  innhaldstypeOptions: OptionType[];
  innhaldstypeId: string;
  onChangeType: (type: string) => void;
}

const PageTypeSelector = ({
  nettsideOptions,
  sideId,
  onChangeSide,
  innhaldstypeOptions,
  innhaldstypeId,
  onChangeType,
}: PageTypeSelectorProps) => {
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
          typeId={sideId}
          onChangeType={onChangeSide}
          options={nettsideOptions}
        />
      </div>
    </div>
  );
};

export default PageTypeSelector;
