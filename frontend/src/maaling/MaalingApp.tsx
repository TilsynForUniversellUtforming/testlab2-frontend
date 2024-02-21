import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { withErrorHandling } from '@common/util/apiUtils';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { fetchLoeysingList } from '@loeysingar/api/loeysing-api';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import { listTestreglar } from '@testreglar/api/testreglar-api';
import { Regelsett, TestregelBase } from '@testreglar/api/types';
import { Verksemd } from '@verksemder/api/types';
import getVerksemdList_dummy from '@verksemder/api/verksemd-api';
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { User } from '../user/api/types';
import { getAdvisors_dummy } from '../user/api/user-api';
import {
  fetchMaaling,
  fetchMaalingList,
  updateMaalingStatus,
} from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext, MaalingTestStatus } from './types';

const MaalingApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMaaling, setLoadingMaaling] = useState<boolean>(true);
  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
  });
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [verksemdList, setVerksemdList] = useState<Verksemd[]>([]);
  const [regelsettList, setRegelsettList] = useState<Regelsett[]>([]);
  const [testregelList, setTestregelList] = useState<TestregelBase[]>([]);
  const [advisorList, setAdvisorList] = useState<User[]>([]);
  const [utvalList, setUtvalList] = useState<Utval[]>([]);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);
  const [pollMaaling, setPollMaaling] = useState(
    maaling?.status === 'crawling' || maaling?.status === 'testing'
  );

  const handleSetMaalingList = useCallback((maalingList: Maaling[]) => {
    setMaalingList(maalingList);
  }, []);

  const handleSetMaaling = useCallback((maaling: Maaling) => {
    setMaaling(maaling);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    if (isDefined(error)) {
      setMaaling(undefined);
    }
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const clearTestStatus = useCallback(() => {
    setTestStatus({ loading: false, message: undefined });
  }, []);

  const handleRefreshing = useCallback((pollMaaling: boolean) => {
    setPollMaaling(pollMaaling);
  }, []);

  const doStartCrawling = useCallback((maaling: Maaling) => {
    setTestStatus({ loading: true, message: undefined });
    setError(undefined);

    const startCrawling = async () => {
      const updated = await updateMaalingStatus(maaling.id, 'crawling');
      if (!updated.id) {
        setTestStatus({
          loading: false,
          message: 'Kunne ikkje starte crawling, prøv igjen',
          severity: 'danger',
        });
      } else {
        setMaaling(updated);
        setTestStatus({
          loading: false,
          message: 'Crawling startet',
          severity: 'success',
        });
      }
    };

    startCrawling().catch((e) =>
      setError(toError(e, 'Noko gjekk gale med start av crawling'))
    );
  }, []);

  const doStartTest = useCallback((maaling: Maaling) => {
    setTestStatus({ loading: true, message: undefined });
    setError(undefined);

    if (maaling.crawlResultat.find((cr) => cr.type === 'feila')) {
      setTestStatus({
        loading: false,
        message: 'Kunne ikkje starte test, måling har feil i sideutval',
        severity: 'warning',
      });
    }

    const startTesting = async () => {
      const updated = await updateMaalingStatus(maaling.id, 'testing');
      if (!updated.id) {
        setTestStatus({
          loading: false,
          message: 'Kunne ikkje starte test, prøv igjen',
          severity: 'danger',
        });
      } else {
        setMaaling(updated);
        setTestStatus({
          loading: false,
          message: 'Testing startet',
          severity: 'success',
        });
      }
    };

    startTesting().catch((e) =>
      setError(toError(e, 'Noko gjekk gale med start av test'))
    );
  }, []);

  const doStartPublish = (maaling: Maaling) => {
    setTestStatus({
      loading: false,
      message: `Publisering er ikkje tilgjengelig ennå for måling ${maaling.navn}`,
      severity: 'info',
    });
  };

  const doFetchMaaling = useCallback(
    withErrorHandling(
      async () => {
        if (id) {
          const maaling = await fetchMaaling(Number(id));
          setPollMaaling(
            maaling?.status === 'crawling' || maaling?.status === 'testing'
          );
          setLoadingMaaling(false);
          return maaling;
        } else {
          throw new Error('Måling ikkje funnet');
        }
      },
      'Kunne ikkje hente måling',
      setError
    ),
    [id]
  );

  const doFetchData = useCallback(
    withErrorHandling(
      async () => {
        const [
          maalingList,
          loeysingList,
          utvalList,
          regelsett,
          testregelList,
          advisors,
          verksemdList,
        ] = await Promise.all([
          fetchMaalingList(),
          fetchLoeysingList(),
          fetchUtvalList(),
          fetchRegelsettList(),
          listTestreglar(),
          getAdvisors_dummy(),
          getVerksemdList_dummy(),
        ]);

        return {
          maalingList,
          loeysingList,
          utvalList,
          regelsett,
          testregelList,
          advisors,
          verksemdList,
        };
      },
      'Kan ikkje hente data',
      setError
    ),
    []
  );

  useEffectOnce(() => {
    setLoading(true);
    doFetchData()
      .then((data) => {
        if (data) {
          if (data?.maalingList) {
            setMaalingList(data.maalingList);
          } else {
            setError(new Error('Kunne ikkje hente liste med målingar'));
          }

          if (data?.loeysingList) {
            setLoeysingList(data.loeysingList);
          } else {
            setError(new Error('Kunne ikkje hente loeysingar'));
          }

          if (data?.regelsett) {
            setRegelsettList(data.regelsett);
          } else {
            setError(new Error('Kunne ikkje hente regelsett'));
          }

          if (data?.testregelList) {
            setTestregelList(data.testregelList);
          } else {
            setError(new Error('Kunne ikkje hente testreglar'));
          }

          if (data?.advisors) {
            setAdvisorList(data.advisors);
          } else {
            setError(new Error('Kunne ikkje hente rådgivere'));
          }

          if (data?.verksemdList) {
            setVerksemdList(data.verksemdList);
          } else {
            setError(new Error('Kunne ikkje hente verksemder'));
          }

          if (data?.utvalList) {
            setUtvalList(data.utvalList);
          } else {
            setError(new Error('Kunne ikkje hente utval'));
          }

          if (id) {
            setLoadingMaaling(true);
            doFetchMaaling()
              .then((data) => {
                if (data) {
                  setMaaling(data);
                } else {
                  setError(new Error('Kunne ikkje hente måling'));
                }
              })
              .catch((e) => {
                setError(toError(e, 'Kunne ikkje hente data'));
                setLoadingMaaling(false);
              });
          }

          setLoading(false);
        } else {
          setError(new Error('Kunne ikkje hente målingar'));
          setLoading(false);
        }
      })
      .catch((e) => {
        setError(toError(e, 'Kunne ikkje hente målingar'));
        setLoading(false);
      });
  });

  useEffect(() => {
    if (
      !loading &&
      !error &&
      id &&
      (maaling?.id !== Number(id) || isNotDefined(maaling))
    ) {
      setLoadingMaaling(true);
      doFetchMaaling()
        .then((data) => {
          if (data) {
            setMaaling(data);
          } else {
            setError(new Error('Kunne ikkje hente måling'));
          }
          setLoadingMaaling(false);
        })
        .catch((e) => {
          setError(toError(e, 'Kunne ikkje hente data'));
        });
    }
  }, [id, error, maaling]);

  const maalingContext: MaalingContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refreshMaaling: doFetchMaaling,
    refresh: doFetchData,
    maalingList: maalingList,
    setMaalingList: handleSetMaalingList,
    loeysingList: loeysingList,
    verksemdList: verksemdList,
    regelsettList: regelsettList,
    testregelList: testregelList,
    utvalList: utvalList,
    handleStartCrawling: doStartCrawling,
    handleStartTest: doStartTest,
    handleStartPublish: doStartPublish,
    advisors: advisorList,
    testStatus: testStatus,
    clearTestStatus: clearTestStatus,
    pollMaaling: pollMaaling,
    setPollMaaling: handleRefreshing,
    loadingMaaling: loadingMaaling,
  };

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;
