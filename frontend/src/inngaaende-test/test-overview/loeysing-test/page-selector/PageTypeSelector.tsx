import './page-selector.scss';

import { Heading } from '@digdir/design-system-react';
import { NettsidePropertyType } from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { NettsideProperties } from '@sak/types';
import PageTypeDropdown from '@test/test-overview/loeysing-test/page-selector/PageTypeDropdown';

export interface PageTypeSelectorProps {
  sakProperties: NettsideProperties[];
  pageType: NettsidePropertyType;
  onChangePageType: (pageType?: NettsidePropertyType) => void;
}

const PageTypeSelector = ({
  sakProperties,
  pageType,
  onChangePageType,
}: PageTypeSelectorProps) => {
  return (
    <div className="page-selector">
      <Heading level={5} size="medium" spacing>
        Vel type test
      </Heading>
      <PageTypeDropdown
        title="Sideutvalg"
        pageType={pageType}
        onChangePageType={onChangePageType}
        sakProperties={sakProperties}
      />
    </div>
  );
};

export default PageTypeSelector;
