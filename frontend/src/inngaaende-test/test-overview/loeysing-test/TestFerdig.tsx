import { Button } from '@digdir/design-system-react';

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
      <div>
        <div className={'test-param-selection'}>
          Du har no testa alle innholdstypar og alle sideutval for {loeysing}.
        </div>
        <Button onClick={onClickResultat}>Sjå resultat</Button>
      </div>
    );
  }
};
export default TestFerdig;
