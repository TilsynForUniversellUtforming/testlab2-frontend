import { Button, Heading, Tag } from '@digdir/design-system-react';

interface Props {
  name: string;
  onClick: () => void;
}

const TestLoeysingButton = ({ name, onClick }: Props) => (
  <div className="manual-test__loeysing-button">
    <div className="manual-test__loeysing-button-tag">
      <Tag color="first" size="small" variant="secondary">
        Ikke startet
      </Tag>
    </div>
    <div className="manual-test__loeysing-button-content">
      <Heading size="medium" level={4}>
        {name}
      </Heading>
      <Tag color="second" size="medium" variant="secondary">
        Inngående kontroll
      </Tag>
      <Button title="Start testing" onClick={onClick}>
        Start testing
      </Button>
    </div>
  </div>
);

export default TestLoeysingButton;
