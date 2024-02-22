import { ButtonVariant } from '@common/types';
import { getFullPath, idPath, IdReplacement } from '@common/util/routeUtils';
import { Button, Heading, Tag } from '@digdir/design-system-react';
import { SakContext } from '@sak/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { getTestresultatAggregert } from '../../../resultat/resultat-api';
import { TESTRESULTAT_TESTGRUNNLAG } from '../../../resultat/ResultatRoutes';

const TestFerdig = () => {
  const { sak }: SakContext = useOutletContext();
  const { sakId, loeysingId } = useParams();
  const navigate = useNavigate();
  const [loeysingNamn, setLoeysingNamn] = useState<string>('');

  const onFerdigTest = useCallback(async () => {
    await getTestresultatAggregert(Number(sakId));
    navigate(
      getFullPath(TESTRESULTAT_TESTGRUNNLAG, {
        pathParam: idPath,
        id: sakId,
      } as IdReplacement)
    );
  }, [sakId]);

  useEffect(() => {
    const foundLoeysing = sak?.loeysingList.find(
      (l) => l.loeysing.id === Number(loeysingId)
    );
    if (foundLoeysing) {
      setLoeysingNamn(foundLoeysing.loeysing.namn);
    }
  }, [loeysingId, sak?.loeysingList]);

  return (
    <div className="statusFerdig">
      <div className={'test-param-selection'}>
        <Heading size="small" level={6}>
          Ferdig testa
        </Heading>
        <Tag color="success" size="medium">
          {loeysingNamn}
        </Tag>
        Du har no testa alle innholdstypar og alle sideutval for {loeysingNamn}.
      </div>
      <div className={'teststatus-buttons'}>
        <Button variant={ButtonVariant.Outline} onClick={onFerdigTest}>
          Sjå resultat
        </Button>
      </div>
    </div>
  );
};
export default TestFerdig;
