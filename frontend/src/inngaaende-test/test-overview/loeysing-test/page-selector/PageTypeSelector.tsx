import './page-selector.scss';

import { OptionType } from '@common/types';
import { capitalize } from '@common/util/stringutils';
import { isDefined, isOption } from '@common/util/validationUtils';
import { Heading } from '@digdir/design-system-react';
import { NettsideProperties } from '@sak/types';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';
import { innhaldsType, PageType } from '@test/types';

export interface PageTypeSelectorProps {
  nettsideProperties: NettsideProperties[];
  pageType: PageType;
  onChangePageType: (pageType?: string) => void;
  contentType: string;
  onChangeContentType: (contentType?: string) => void;
}

const PageTypeSelector = ({
  nettsideProperties,
  pageType,
  onChangePageType,
  contentType,
  onChangeContentType,
}: PageTypeSelectorProps) => {
  const contentOptions = innhaldsType.map((innhandsType) => ({
    value: innhandsType,
    label: innhandsType,
  }));

  const pageOptions = nettsideProperties
    .map(({ type }) => {
      if (isDefined(type)) {
        const option: OptionType = { value: type, label: capitalize(type) };
        return option;
      }
    })
    .filter(isOption);

  return (
    <div className="page-selector">
      <Heading level={5} size="medium" spacing>
        Vel type test
      </Heading>
      <div className="page-selector-wrapper">
        <TypeDropdown
          title="Innhaldstypar"
          selectedType={contentType}
          onChangeType={onChangeContentType}
          options={contentOptions}
        />
        <TypeDropdown
          title="Sideutvalg"
          selectedType={pageType.pageType}
          onChangeType={onChangePageType}
          options={pageOptions}
        />
      </div>
    </div>
  );
};

export default PageTypeSelector;
