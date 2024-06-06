import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import { OptionType } from '@common/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import {
  createTestResultat,
  deleteTestResultat,
  updateTestResultat,
  updateTestResultatMany,
} from '@test/api/testing-api';
import {
  CreateTestResultat,
  ResultatManuellKontroll,
  ResultatStatus,
  toElementResultat,
} from '@test/api/types';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import {
  ActiveTest,
  ContextKontroll,
  ManuellTestStatus,
  PageType,
  TestContextKontroll,
  TestOverviewLoaderResponse,
  TestResultUpdate,
} from '@test/types';
import {
  findActiveTestResults,
  innhaldstypeAlle,
  isTestFinished,
  mapTestregelOverviewElements,
  toTestregelStatus,
  toTestregelStatusKey,
} from '@test/util/testregelUtils';
import {
  getInitialPageTypeKontroll,
  getSideutvalOptionList,
  progressionForLoeysingNettsideKontroll,
  toSideutvalTestside,
} from '@test/util/testregelUtilsKontroll';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { testgrunnlagId: testgrunnlagId, loeysingId: loeysingIdParam } =
    useParams();
  const {
    contextKontroll,
    innhaldstypeList,
    sideutvalTypeList,
  }: TestContextKontroll = useOutletContext();
  const [innhaldstype, setInnhaldstype] =
    useState<InnhaldstypeTesting>(innhaldstypeAlle);
  const { results } = useLoaderData() as TestOverviewLoaderResponse;
  const loeysingId = Number(loeysingIdParam);

  const [testResults, setTestResults] =
    useState<ResultatManuellKontroll[]>(results);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [alert, setAlert, modalRef] = useAlertModal();
  const [testFerdig, setTestFerdig] = useState(
    isTestFinished(
      testResults,
      contextKontroll.testregelList.map((tr) => tr.id),
      loeysingId,
      contextKontroll.sideutvalList
        .filter((l) => loeysingId === l.loeysingId)
        .map((su) => `${su.typeId}_${su.egendefinertType ?? ''}`).length
    )
  );

  const [sideutvalOptionList, setSideutvalOptionList] = useState<OptionType[]>(
    getSideutvalOptionList(contextKontroll, sideutvalTypeList, loeysingId)
  );
  const [pageType, setPageType] = useState<PageType>(
    getInitialPageTypeKontroll(contextKontroll.sideutvalList, sideutvalTypeList)
  );

  const [progressionPercent, setProgressionPercent] = useState(
    progressionForLoeysingNettsideKontroll(
      contextKontroll,
      results,
      pageType.sideId,
      innhaldstype,
      loeysingId
    )
  );
  const [testregelList, setTestregelList] = useState(
    mapTestregelOverviewElements(contextKontroll.testregelList, innhaldstype)
  );
  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelList,
      results,
      Number(testgrunnlagId),
      loeysingId,
      pageType.sideId
    )
  );

  const [showHelpText, setShowHelpText] = useState(true);

  const toggleShowHelpText = () => {
    setShowHelpText((showHelpText) => !showHelpText);
  };

  const handleSetInactiveTest = useCallback(() => {
    setActiveTest(undefined);
  }, []);

  const processData = (
    contextKontroll: ContextKontroll,
    testResultsLoeysing: ResultatManuellKontroll[],
    loeysingId: number,
    pageType: PageType,
    innhaldstype: InnhaldstypeTesting,
    activeTestregel?: Testregel
  ) => {
    const testregelList = mapTestregelOverviewElements(
      contextKontroll.testregelList,
      innhaldstype
    );

    const sideutvalOptions = getSideutvalOptionList(
      contextKontroll,
      sideutvalTypeList,
      loeysingId
    );

    setTestregelList(testregelList);
    setSideutvalOptionList(sideutvalOptions);
    setProgressionPercent(
      progressionForLoeysingNettsideKontroll(
        contextKontroll,
        testResultsLoeysing,
        pageType.sideId,
        innhaldstype,
        loeysingId
      )
    );

    setTestStatusMap(
      toTestregelStatus(
        testregelList,
        testResultsLoeysing,
        Number(testgrunnlagId),
        loeysingId,
        pageType.sideId
      )
    );

    const finished = isTestFinished(
      testResultsLoeysing,
      contextKontroll.testregelList.map((tr) => tr.id),
      loeysingId,
      sideutvalOptions.length
    );
    setTestFerdig(finished);

    if (activeTestregel) {
      setActiveTest({
        testregel: activeTestregel,
        testResultList: findActiveTestResults(
          testResultsLoeysing,
          Number(testgrunnlagId),
          loeysingId,
          activeTestregel.id,
          pageType.sideId
        ),
      });
    }
  };

  const createNewTestResult = async (activeTest: ActiveTest) => {
    const numericLoeysingId = loeysingId;

    const nyttTestresultat: CreateTestResultat = {
      testgrunnlagId: Number(testgrunnlagId),
      loeysingId: numericLoeysingId,
      testregelId: activeTest.testregel.id,
      sideutvalId: pageType.sideId,
    };
    const alleResultater = await createTestResultat(nyttTestresultat);
    setTestResults(alleResultater);
    processData(
      contextKontroll,
      alleResultater,
      numericLoeysingId,
      pageType,
      innhaldstype,
      activeTest.testregel
    );
  };

  const onChangePageType = useCallback(
    (sideutvalId?: string) => {
      const sideutvalIdNumeric = Number(sideutvalId);
      if (isDefined(sideutvalIdNumeric)) {
        const nextSideutvalTestside = toSideutvalTestside(
          contextKontroll.sideutvalList,
          sideutvalTypeList,
          sideutvalIdNumeric
        );
        setPageType(nextSideutvalTestside);
        setActiveTest(undefined);
        processData(
          contextKontroll,
          testResults,
          loeysingId,
          nextSideutvalTestside,
          innhaldstype
        );
      } else {
        setAlert('danger', 'Kan ikkje byta side', 'Ugylig nettside');
      }
    },
    [
      contextKontroll,
      testResults,
      loeysingId,
      sideutvalOptionList,
      innhaldstype,
    ]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: string) => {
      const innhaldstype = innhaldstypeList.find(
        (it) => it.id === Number(innhaldstypeId)
      );
      if (innhaldstype) {
        setInnhaldstype(innhaldstype);
        setActiveTest(undefined);
        processData(
          contextKontroll,
          testResults,
          loeysingId,
          pageType,
          innhaldstype
        );
      }
    },
    [contextKontroll, testResults, loeysingId, sideutvalOptionList, pageType]
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setActiveTest(undefined);
      const nextTestregel = contextKontroll.testregelList.find(
        (tr) => tr.id === testregelId
      );
      if (!nextTestregel) {
        setAlert(
          'danger',
          'Kan ikkje byta testregel',
          'Det oppstod ein feil ved byting av testregel'
        );
      } else {
        if (nextTestregel.id === activeTest?.testregel.id) {
          setActiveTest(undefined);
          return;
        }

        const testgrunnlagIdNumeric = Number(testgrunnlagId);
        const loeysingIdNumeric = loeysingId;

        const statusKey = toTestregelStatusKey(
          testgrunnlagIdNumeric,
          loeysingIdNumeric,
          nextTestregel.id,
          pageType.sideId
        );
        const testregelStatus = testStatusMap.get(statusKey);

        if (testregelStatus && testregelStatus === 'ikkje-starta') {
          doCreateTestResult(
            testgrunnlagIdNumeric,
            loeysingIdNumeric,
            nextTestregel,
            pageType.sideId
          );
        } else {
          processData(
            contextKontroll,
            testResults,
            loeysingId,
            pageType,
            innhaldstype,
            nextTestregel
          );
        }
      }
    },
    [
      testgrunnlagId,
      loeysingId,
      contextKontroll,
      testResults,
      pageType,
      innhaldstype,
      activeTest,
    ]
  );

  const onChangeTestregelStatus = useCallback(
    (status: ManuellTestStatus, testregelId: number) => {
      const testgrunnlagIdNumeric = Number(testgrunnlagId);
      const loeysingIdNumeric = loeysingId;

      const testregel = contextKontroll.testregelList.find(
        (tr) => tr.id === testregelId
      );
      const selectedTestresultat = testResults.filter(
        (tr) => tr.testregelId === testregelId
      );
      const newStatus = mapStatus(status);

      if (testStatusMap && testregel) {
        if (status === 'under-arbeid' && isNotDefined(selectedTestresultat)) {
          doCreateTestResult(
            testgrunnlagIdNumeric,
            loeysingIdNumeric,
            testregel,
            pageType.sideId
          );
        } else {
          const isElementSide =
            JSON.parse(testregel.testregelSchema).element.toLowerCase() ===
            'side';
          const missingKommentar =
            isElementSide &&
            selectedTestresultat.filter((tr) => isDefined(tr.kommentar))
              .length !== selectedTestresultat.length;

          const notFinished = selectedTestresultat.filter((tr) =>
            isNotDefined(tr.elementResultat)
          );
          if (status === 'ferdig' && notFinished.length > 0) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før man har eit utfall for alle testelement'
            );
          } else if (status === 'ferdig' && missingKommentar) {
            setAlert(
              'warning',
              `Kan ikkje sette status ${status}`,
              'Ferdigstatus kan ikkje settast før alle testelement har kommentar til resultat'
            );
          } else {
            const updatedtestResults: ResultatManuellKontroll[] =
              selectedTestresultat.map((testResult) => ({
                id: testResult.id,
                testgrunnlagId: testgrunnlagIdNumeric,
                loeysingId: loeysingIdNumeric,
                testregelId: testregelId,
                sideutvalId: testResult.sideutvalId,
                elementOmtale: testResult.elementOmtale,
                elementResultat: testResult.elementResultat,
                elementUtfall: testResult.elementUtfall,
                testVartUtfoert: testResult.testVartUtfoert,
                svar: testResult.svar,
                status: newStatus,
                kommentar: testResult.kommentar,
              }));

            doUpdateTestResultStatus(updatedtestResults);
            if (testregelId === activeTest?.testregel.id) {
              setActiveTest(undefined);
            }
          }
        }
      }
    },
    [
      contextKontroll,
      testStatusMap,
      loeysingId,
      testResults,
      pageType.sideId,
      activeTest,
    ]
  );

  // Create test result when the block is opened
  const doCreateTestResult = useCallback(
    async (
      testgrunnlagId: number,
      loeysingId: number,
      activeTestregel: Testregel,
      sideutvalId: number | undefined
    ) => {
      if (activeTestregel && sideutvalId) {
        const testResult: CreateTestResultat = {
          testgrunnlagId: testgrunnlagId,
          loeysingId: loeysingId,
          testregelId: activeTestregel.id,
          sideutvalId: sideutvalId,
        };

        try {
          const createdTestResults = await createTestResultat(testResult);
          setTestResults(createdTestResults);
          processData(
            contextKontroll,
            createdTestResults,
            loeysingId,
            pageType,
            innhaldstype,
            activeTestregel
          );
        } catch (e) {
          setAlert('danger', 'Kunne ikkje lagre', 'Opprett testresultat feila');
        }
      } else {
        setAlert(
          'danger',
          'Kunne ikkje lagre',
          'Ugyldig oppretting av testresultat'
        );
      }
    },
    [contextKontroll, loeysingId, activeTest, pageType, innhaldstype]
  );

  const doUpdateTestResult = useCallback(
    async (testResultUpdate: TestResultUpdate) => {
      const { resultatId, alleSvar, resultat, elementOmtale, kommentar } =
        testResultUpdate;
      const testgrunnlagIdNumeric = Number(testgrunnlagId);
      const loeysingIdNumeric = loeysingId;

      const activeTestResult = testResults.find(
        (testResult) => testResult.id === resultatId
      );

      if (
        isDefined(testgrunnlagIdNumeric) &&
        isDefined(loeysingIdNumeric) &&
        activeTest &&
        pageType.sideId &&
        activeTestResult
      ) {
        const testResult: ResultatManuellKontroll = {
          id: activeTestResult.id,
          testgrunnlagId: testgrunnlagIdNumeric,
          loeysingId: loeysingIdNumeric,
          testregelId: activeTest.testregel?.id,
          sideutvalId: pageType.sideId,
          elementOmtale,
          elementResultat: resultat && toElementResultat(resultat),
          elementUtfall: resultat?.utfall,
          svar: alleSvar,
          status: mapStatus('under-arbeid'),
          kommentar: kommentar,
        };

        try {
          const updatedTestResults = await updateTestResultat(testResult);
          await createTestresultatAggregert(Number(testgrunnlagId)).catch(
            (e) => {
              setAlert(
                'danger',
                'Kunne ikkje oppdatere aggregert resultat',
                `Oppdatering av aggregert resultat feila ${e}`
              );
            }
          );
          setTestResults(updatedTestResults);
          processData(
            contextKontroll,
            updatedTestResults,
            loeysingIdNumeric,
            pageType,
            innhaldstype,
            activeTest?.testregel
          );
        } catch (e) {
          setAlert(
            'danger',
            'Kunne ikkje lagre',
            'Oppdatering av testresultat feila'
          );
        }
      } else {
        setAlert(
          'danger',
          'Kunne ikkje lagre',
          'Ugyldig oppdatering av testresultat'
        );
      }
    },
    [
      testgrunnlagId,
      loeysingId,
      activeTest,
      testResults,
      pageType.sideId,
      innhaldstype,
    ]
  );

  const slettTestelement = async (
    activeTest: ActiveTest,
    resultatId: number
  ) => {
    const resultat = testResults.find((tr) => tr.id === resultatId);
    if (!resultat) {
      setAlert(
        'danger',
        'Resultatet finnes ikkje',
        `Vi prøvde å slette resultatet med id ${resultatId}, men det eksisterer ikkje.`
      );
      return;
    }
    try {
      const alleResultater = await deleteTestResultat(resultat);
      setTestResults(alleResultater);
      processData(
        contextKontroll,
        alleResultater,
        loeysingId,
        pageType,
        innhaldstype,
        activeTest.testregel
      );
    } catch (e) {
      setAlert(
        'danger',
        'Kunne ikkje slette test',
        'Sletting av test for testregel feila'
      );
    }
  };

  const doUpdateTestResultStatus = useCallback(
    async (testResultat: ResultatManuellKontroll[]) => {
      try {
        const updatedTestResults = await updateTestResultatMany(testResultat);
        await createTestresultatAggregert(Number(testgrunnlagId)).catch((e) => {
          setAlert(
            'danger',
            'Kunne ikkje oppdatere aggregert resultat',
            `Oppdatering av aggregert resultat feila ${e}`
          );
        });
        setTestResults(updatedTestResults);
        processData(
          contextKontroll,
          updatedTestResults,
          loeysingId,
          pageType,
          innhaldstype
        );
      } catch (e) {
        setAlert(
          'danger',
          'Kunne ikkje endre status',
          'Oppdatering av status for testresultat feila'
        );
      }
    },
    [
      contextKontroll,
      loeysingId,
      activeTest,
      pageType,
      innhaldstype,
      testgrunnlagId,
    ]
  );

  const mapStatus = (frontendState: ManuellTestStatus): ResultatStatus => {
    switch (frontendState) {
      case 'ferdig':
        return 'Ferdig';
      case 'deaktivert':
        return 'Deaktivert';
      case 'under-arbeid':
        return 'UnderArbeid';
      case 'ikkje-starta':
        return 'IkkjePaabegynt';
    }
  };

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert]);

  const loeysingNamn =
    contextKontroll.loeysingList.find((l) => l.id === loeysingId)?.namn ?? '';

  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        title={contextKontroll.tittel}
        currentLoeysingName={loeysingNamn}
        sideutvalOptionList={sideutvalOptionList}
        pageType={pageType}
        onChangePageType={onChangePageType}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
      />
      {testFerdig && <TestFerdig loeysingNamn={loeysingNamn} />}
      <div className="manual-test-wrapper">
        <div className="manual-test-buttons">
          <LoeysingTestContent
            pageType={pageType}
            innhaldstype={innhaldstype}
            progressionPercent={progressionPercent}
            testStatusMap={testStatusMap}
            testregelList={testregelList}
            activeTest={activeTest}
            clearActiveTestregel={handleSetInactiveTest}
            onChangeTestregel={onChangeTestregel}
            createNewTestResult={createNewTestResult}
            doUpdateTestResult={doUpdateTestResult}
            slettTestelement={slettTestelement}
            onChangeStatus={onChangeTestregelStatus}
            toggleShowHelpText={toggleShowHelpText}
            showHelpText={showHelpText}
          />
        </div>
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
    </div>
  );
};

export default TestOverviewLoeysing;
