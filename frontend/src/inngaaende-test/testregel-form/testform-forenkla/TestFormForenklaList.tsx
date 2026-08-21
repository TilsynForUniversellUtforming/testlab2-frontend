import { Testregel } from '@testreglar/api/types';
import { ElementResultat, ResultatManuellKontroll } from '@test/api/types';
import { TestResultUpdate } from '@test/types';
import TestFormForenkla from '@test/testregel-form/testform-forenkla/TestFormForenkla';
import {
  Button,
  Card,
  Details,
  DetailsContent,
  Heading,
  Tag,
} from '@digdir/designsystemet-react';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import style from '../test-form.module.scss';

import commonClasses from '@test/testregel-form/test-form-accordion.module.css';
import React from 'react';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement?: (resultatId: number) => void;
  isLoading?: boolean;
  isDemoApp?: boolean;
  onCreateForenklaResultat?: (resultat: ResultatManuellKontroll) => void;
}

const TestFormForenklaList = (props: Props) => {

  const resultatList:ResultatManuellKontroll[] = [];

  if(props.resultater.length === 0){
    resultatList.push(createForenklaBaseResultat({
      testregelId: props.testregel.id,
    }));
  }
  else {
    resultatList.push(...props.resultater);
  }

  return (
    <div className={style.testForm}>
      <Heading data-size="md" level={3}>
        {props.testregel.namn}
      </Heading>
      <div className={commonClasses.skjemaer}>
        {resultatList.map((resultat, index) => (
          <div key={resultat.id}>
            <Card>
              <Details className={commonClasses.accordionDetails}>
                <Details.Summary className={commonClasses.accordionButton}>
                  <div>{index + 1}</div>
                  <span>{resultat.elementOmtale}</span>
                  <TestlabStatusTag<ElementResultat>
                    className={commonClasses.resultat}
                    status={resultat.elementResultat}
                    colorMapping={{
                      danger: ['brot'],
                      success: ['samsvar'],
                      warning: ['advarsel'],
                      info: ['ikkjeForekomst', 'ikkjeTesta'],
                    }}
                    data-size="md"
                  />
                </Details.Summary>
                <DetailsContent>
                  <TestFormForenkla
                    testregel={props.testregel}
                    showHelpText={props.showHelpText}
                    onResultat={props.onResultat}
                    slettTestelement={props.slettTestelement}
                    isLoading={props.isLoading}
                    isDemoApp={props.isDemoApp}
                    onCreateForenklaResultat={props.onCreateForenklaResultat}
                    activeResult={resultat}
                  />
                </DetailsContent>
              </Details>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  
}

export default TestFormForenklaList;

function createForenklaBaseResultat({
  testregelId,
}: {
  testregelId: number;
}): ResultatManuellKontroll {
  return {
    id: 0,
    svar: [],
    status: 'UnderArbeid',
    testgrunnlagId: 0,
    loeysingId: 0,
    testregelId,
    sideutvalId: 0,
    sistLagra: new Date().toISOString(),
  };
}
