import { Heading, Ingress, Tag } from '@digdir/design-system-react';

export interface Props {
  sakName: string;
  currentLoeysingName: string;
}

const TestHeading = ({ sakName, currentLoeysingName }: Props) => {
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
    </div>
  );
};

export default TestHeading;
