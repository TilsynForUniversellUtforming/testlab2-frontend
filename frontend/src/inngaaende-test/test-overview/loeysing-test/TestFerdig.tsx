import { ButtonVariant } from '@common/types';
import { Button, Heading, Tag } from '@digdir/design-system-react';

const TestFerdig = ({
  statusFerdig,
  loeysing,
  onClickResultat,
}: {
  statusFerdig: boolean;
  loeysing: string;
  onClickResultat: () => void;
}) => {
  if (statusFerdig) {
    return (
      <div className="statusFerdig">
        <div className={'test-param-selection'}>
          <Heading size="small" level={6}>
            Ferdig testa
          </Heading>
          <Tag color="success" size="medium">
            {loeysing}
          </Tag>
          Du har no testa alle innholdstypar og alle sideutval for {loeysing}.
        </div>
        <div className={'teststatus-buttons'}>
          <Button variant={ButtonVariant.Outline} onClick={onClickResultat}>
            Sjå resultat
          </Button>
        </div>
      </div>
    );
  }
};
export default TestFerdig;
