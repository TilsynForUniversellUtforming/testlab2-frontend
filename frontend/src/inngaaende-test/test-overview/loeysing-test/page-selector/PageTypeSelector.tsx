import './page-selector.scss';

import { Heading } from '@digdir/design-system-react';
import { NettsideProperties } from '@sak/types';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';

export interface PageTypeSelectorProps {
  sakProperties: NettsideProperties[];
  pageType: string;
  onChangePageType: (pageType?: string) => void;
  contentType: string;
  onChangeContentType: (contentType?: string) => void;
}

const PageTypeSelector = ({
  sakProperties,
  pageType,
  onChangePageType,
  contentType,
  onChangeContentType,
}: PageTypeSelectorProps) => {
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
          sakProperties={sakProperties}
        />
        <TypeDropdown
          title="Sideutvalg"
          selectedType={pageType}
          onChangeType={onChangePageType}
          sakProperties={sakProperties}
        />
      </div>
    </div>
  );
};

export default PageTypeSelector;
