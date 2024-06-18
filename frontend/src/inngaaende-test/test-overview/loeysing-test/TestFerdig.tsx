import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import { ButtonColor } from '@common/types';
import { getFullPath, idPath, IdReplacement } from '@common/util/routeUtils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { TESTRESULTAT_LOEYSING } from '@resultat/ResultatRoutes';
import { useNavigate, useParams } from 'react-router-dom';

const TestFerdig = ({ loeysingNamn }: { loeysingNamn: string }) => {
  const { testgrunnlagId: testgrunnlagId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert, modalRef] = useAlertModal();

  const onFerdigTest = async () => {
    await createTestresultatAggregert(Number(testgrunnlagId))
      .then(() => {
        navigate(
          getFullPath(TESTRESULTAT_LOEYSING, {
            pathParam: idPath,
            id: testgrunnlagId,
          } as IdReplacement)
        );
      })
      .catch((error) => {
        console.error(error);
        setAlert(
          'danger',
          'Feil med lagring',
          'Kunne ikke lagre aggregert testresultat'
        );
      });
  };

  return (
    <div className="status-ferdig">
      <Alert severity="success">
        <Heading level={5} size="xs" spacing>
          {loeysingNamn} er ferdig testa!
        </Heading>
        <Paragraph spacing>
          Du har no testa alle innhaldstypar for alle sideutval og kan gå vidare
          for å sjå resultatet.
        </Paragraph>
        <Button
          color={ButtonColor.Success}
          onClick={onFerdigTest}
          className="status-ferdig__button"
        >
          Gå til resultat
        </Button>
      </Alert>
      {alert && (
        <AlertModal
          ref={modalRef}
          severity={alert.severity}
          title={alert.title}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};
export default TestFerdig;
