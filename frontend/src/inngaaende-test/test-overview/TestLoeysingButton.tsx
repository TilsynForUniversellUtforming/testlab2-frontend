import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import { ManuellTestStatus } from '@test/types';

import classes from './test-loeysing-button.module.css';

interface Props {
  name: string;
  onClick: () => void;
  status: ManuellTestStatus;
}

const TestLoeysingButton = ({ name, onClick, status }: Props) => (
  <div className="manual-test__loeysing-button">
    <div className="tag-wrapper">
      <TestlabStatusTag<ManuellTestStatus>
        status={status}
        colorMapping={{
          second: ['under-arbeid'],
          info: ['ikkje-starta'],
          first: ['ferdig'],
        }}
        size="small"
      />
    </div>
    <div className="content-wrapper">
      <div className="content">
        <Heading size="medium" level={4} spacing>
          {name}
        </Heading>
        <Tag color="second" size="small">
          Inngående kontroll
        </Tag>
        <Tag color="info" size="small">
          Nettsted
        </Tag>
      </div>
      <div className={classes.buttons}>
        <Button title="Start testing" onClick={onClick}>
          {status === 'ikkje-starta' ? 'Start testing' : 'Fortsett testing'}
        </Button>
        {status === 'ferdig' && <Button variant="secondary">Retest</Button>}
      </div>
    </div>
  </div>
);

export default TestLoeysingButton;
