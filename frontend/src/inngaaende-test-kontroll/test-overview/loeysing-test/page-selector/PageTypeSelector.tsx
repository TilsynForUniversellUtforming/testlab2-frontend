import './page-selector.scss';

import { capitalize } from '@common/util/stringutils';
import { isDefined, isOption } from '@common/util/validationUtils';
import { Heading } from '@digdir/designsystemet-react';
import { NettsideProperties } from '@sak/types';
import TypeDropdown from '@test/test-overview/loeysing-test/page-selector/TypeDropdown';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

export interface PageTypeSelectorProps {
  nettsideProperties: NettsideProperties[];
  pageType: PageType;
  onChangePageType: (nettsideId: string) => void;
  innhaldstypeList: InnhaldstypeTesting[];
  innhaldstype: InnhaldstypeTesting;
  onChangeInnhaldstype: (innhaldstypeId: string) => void;
}

const PageTypeSelector = ({
  nettsideProperties,
  pageType,
  onChangePageType,
  innhaldstypeList,
  innhaldstype,
  onChangeInnhaldstype,
}: PageTypeSelectorProps) => {
  const innhaldstypeOptions = innhaldstypeList.map(({ id, innhaldstype }) => ({
    value: String(id),
    label: innhaldstype,
  }));

  const pageOptions = nettsideProperties
    .map(({ id, type }) => {
      if (isDefined(id) && isDefined(type)) {
        return {
          value: String(id),
          label: capitalize(type),
        };
      }
    })
    .filter(isOption);

  return (
    <div className="page-selector">
      <Heading level={3} size="small" spacing>
        Vel type test
      </Heading>
      <div className="page-selector-wrapper">
        <TypeDropdown
          title="Innhaldstypar"
          typeId={String(innhaldstype.id)}
          onChangeType={onChangeInnhaldstype}
          options={innhaldstypeOptions}
        />
        <TypeDropdown
          title="Sideutvalg"
          typeId={String(pageType.nettsideId)}
          onChangeType={onChangePageType}
          options={pageOptions}
        />
      </div>
    </div>
  );
};

export default PageTypeSelector;
