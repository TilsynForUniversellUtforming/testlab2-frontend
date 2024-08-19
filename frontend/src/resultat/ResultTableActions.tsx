import { Button } from '@digdir/designsystemet-react';
import { genererWordRapport } from '@resultat/resultat-api';
import { useParams } from 'react-router-dom';

const ResultTableActions = () => {
  const { id, loeysingId } = useParams();

  const genererRapport = () => {
    console.log('Generer rapport');
    genererWordRapport(Number(id), Number(loeysingId));
  };

  return (
    <div className={'resultat-actions'}>
      <Button
        variant="primary"
        onClick={genererRapport}
        download
        target="_blank"
      >
        Generer wordrapport
      </Button>
    </div>
  );
};

export default ResultTableActions;
