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
  sakProperties,
  pageType,
  onChangePageType,
}: Props) => {
  return (
    <div className="manual-test-heading">
      <Heading spacing size="xlarge" level={3}>
        Gjennomfør test
      </Heading>
      <Ingress spacing>{sakName}</Ingress>
      <div className="tags">
        <Tag color="second" size="small">
          Inngående kontroll
        </Tag>
        <Tag color="second" size="small">
          Nettside
        </Tag>
        <Tag color="second" size="small">
          {currentLoeysingName}
        </Tag>
      </div>
      <PageTypeSelector
        sakProperties={sakProperties}
        pageType={pageType}
        onChangePageType={onChangePageType}
      />
    </div>
  );
};

export default TestHeading;
