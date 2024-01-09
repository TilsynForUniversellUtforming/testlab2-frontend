import { Button, Heading, Tag } from '@digdir/design-system-react';

interface Props {
  name: string;
  onClick: () => void;
}

const TestLoeysingButton = ({ name, onClick }: Props) => (
  <div className="manual-test__loeysing-button">
    <div className="tag-wrapper">
      <div>
        <Tag color="first" size="small" variant="secondary">
          Ikkje startet
        </Tag>
      </div>
    </div>
    <div className="content-wrapper">
      <div className="content">
        <Heading size="medium" level={4} spacing>
          {name}
        </Heading>
        <Tag color="second" size="small" variant="secondary">
          Inngående kontroll
        </Tag>
        <Tag color="info" size="small" variant="secondary">
          Nettsted
        </Tag>
      </div>
      <Button title="Start testing" onClick={onClick}>
        Start testing
      </Button>
    </div>
  </div>
);

export default TestLoeysingButton;
