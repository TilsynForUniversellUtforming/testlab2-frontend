import classes from './test-form-accordion.module.css';
import { Button } from '@digdir/designsystemet-react';
import SistLagra from '@test/test-overview/loeysing-test/SistLagra';
import { TestresultatDetaljer } from '@test/testregel-form/types';


interface Props {
  slettTestelement: (resultatId: number) => void;
  resultatId: number;
  sistLagra?: string;
  isLoading: boolean;
}
export const TestElementFooter = ({slettTestelement,resultatId,isLoading,sistLagra}:Readonly<Props>) => {
  return (<div className={classes.accordionFooter}>
    <Button
      className={classes.removeButton}
      variant="secondary"
      data-size="sm"
      onClick={() => slettTestelement(resultatId)}
    >
      Slett dette testelementet
    </Button>
    <SistLagra sistLagra={sistLagra ?? ''} isLoading={isLoading} />
  </div>)
}


