import { Heading, Ingress, Tag } from '@digdir/design-system-react';
import PageTypeSelector, {
  PageTypeSelectorProps,
} from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';

export interface Props extends PageTypeSelectorProps {
  sakName: string;
  currentLoeysingName: string;
}

const TestHeading = ({
  sakName,
  currentLoeysingName,
  nettsideProperties,
  pageType,
  onChangePageType,
  contentType,
  onChangeContentType,
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
      contentType={contentType}
      onChangeContentType={onChangeContentType}
    />
  </div>
);

export default TestHeading;
