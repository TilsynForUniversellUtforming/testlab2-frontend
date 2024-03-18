import { Heading, Ingress, Tag } from '@digdir/designsystemet-react';
import PageTypeSelector, {
  PageTypeSelectorProps,
} from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { InnhaldstypeTesting } from '@testreglar/api/types';

export interface Props extends PageTypeSelectorProps {
  sakName: string;
  currentLoeysingName: string;
  innhaldstypeList: InnhaldstypeTesting[];
}

const LoeysingTestHeading = ({
  sakName,
  currentLoeysingName,
  nettsideProperties,
  pageType,
  onChangePageType,
  innhaldstype,
  onChangeInnhaldstype,
  innhaldstypeList,
}: Props) => (
  <div className="manual-test-heading">
    <Heading spacing size="xlarge" level={2}>
      Gjennomfør test
    </Heading>
    <Ingress spacing>{sakName}</Ingress>
    <div className="tags">
      <Tag color="second">Inngående kontroll</Tag>
      <Tag color="second">Nettside</Tag>
      <Tag color="second">{currentLoeysingName}</Tag>
    </div>
    <PageTypeSelector
      nettsideProperties={nettsideProperties}
      pageType={pageType}
      onChangePageType={onChangePageType}
      innhaldstypeList={innhaldstypeList}
      innhaldstype={innhaldstype}
      onChangeInnhaldstype={onChangeInnhaldstype}
    />
  </div>
);

export default LoeysingTestHeading;
