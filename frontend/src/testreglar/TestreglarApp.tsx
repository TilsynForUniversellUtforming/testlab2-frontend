import './testreglar.scss';

import ErrorCard from '@common/error/ErrorCard';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { withErrorHandling } from '@common/util/apiUtils';
import { Tabs } from '@digdir/design-system-react';
import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  listInnhaldstype,
  listTema,
  listTestobjekt,
  listTestreglar,
} from './api/testreglar-api';
import {
  InnhaldstypeTesting,
  Regelsett,
  Tema,
  Testobjekt,
  TestregelBase,
} from './api/types';
import { REGELSETT_ROOT } from './TestregelRoutes';
import { TestregelContext } from './types';

type FetchType = {
  testreglar: TestregelBase[];
  regelsett: Regelsett[];
  innhaldsTypeList: InnhaldstypeTesting[];
  temaList: Tema[];
  testobjektList: Testobjekt[];
};

const TestreglarApp = () => {
  const [testreglar, setTestreglar] = useState<TestregelBase[]>([]);
  const [regelsett, setRegelsett] = useState<Regelsett[]>([]);
  const [innhaldsTypeList, setInnhaldsTypeList] = useState<
    InnhaldstypeTesting[]
  >([]);
  const [temaList, setTemaList] = useState<Tema[]>([]);
  const [testobjektList, setTestobjektList] = useState<Testobjekt[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showTestreglar, setShowTestreglar] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const [tab, setTab] = useState(
    location.pathname.includes(REGELSETT_ROOT.path) ? 'regelsett' : 'testreglar'
  );

  useEffect(() => {
    setTab(
      location.pathname.includes(REGELSETT_ROOT.path)
        ? 'regelsett'
        : 'testreglar'
    );
  }, [location.pathname]);

  const handleTestreglar = useCallback((testregelList: TestregelBase[]) => {
    setTestreglar(testregelList);
  }, []);

  const handleRegelsett = useCallback((regelsettList: Regelsett[]) => {
    setRegelsett(regelsettList);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setError(error);
  }, []);

  const doFetchData = useCallback(
    withErrorHandling<FetchType>(
      async () => {
        const [
          testreglar,
          regelsett,
          innhaldsTypeList,
          temaList,
          testobjektList,
        ] = await Promise.all([
          listTestreglar(),
          fetchRegelsettList(true),
          listInnhaldstype(),
          listTema(),
          listTestobjekt(),
        ]);

        return {
          testreglar,
          regelsett,
          innhaldsTypeList,
          temaList,
          testobjektList,
        };
      },
      'Kan ikkje hente testregeldata',
      setError
    ),
    []
  );

  const fetchTestreglar = useCallback(() => {
    setLoading(true);
    doFetchData().then((data: FetchType) => {
      if (data) {
        const {
          testreglar,
          regelsett,
          innhaldsTypeList,
          temaList,
          testobjektList,
        } = data;

        if (testreglar) {
          setTestreglar(testreglar);
        } else {
          setError(new Error('Kunne ikkje hente liste med testreglar'));
        }
        if (regelsett) {
          setRegelsett(regelsett);
        } else {
          setError(new Error('Kunne ikkje hente liste med regelsett'));
        }
        if (innhaldsTypeList) {
          setInnhaldsTypeList(innhaldsTypeList);
        } else {
          setError(new Error('Kunne ikkje hente liste med innhaldstyper'));
        }
        if (temaList) {
          setTemaList(temaList);
        } else {
          setError(new Error('Kunne ikkje hente liste med innhaldstyper'));
        }
        if (testobjektList) {
          setTestobjektList(testobjektList);
        } else {
          setError(new Error('Kunne ikkje hente liste med innhaldstyper'));
        }

        setLoading(false);
      } else {
        setError(new Error('Kunne ikkje hente data'));
        setLoading(false);
      }
    });
    setShowTestreglar(true);
  }, []);

  useEffectOnce(() => {
    fetchTestreglar();
  });

  const testRegelContext: TestregelContext = {
    contextError: error,
    contextLoading: loading,
    testregelList: testreglar,
    regelsettList: regelsett,
    innhaldstypeList: innhaldsTypeList,
    temaList: temaList,
    testobjektList: testobjektList,
    setTestregelList: handleTestreglar,
    setRegelsettList: handleRegelsett,
    setContextError: handleError,
    setContextLoading: handleLoading,
    refresh: doFetchData,
  };

  const handleChange = (name: string) => {
    if (name === 'regelsett') {
      navigate(REGELSETT_ROOT.path);
    } else {
      navigate('.');
    }
  };

  if (!loading && !showTestreglar) {
    return (
      <ErrorCard
        errorHeader="Testreglar"
        error={new Error('Testreglar låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  } else if (error) {
    return (
      <ErrorCard
        errorHeader="Testreglar"
        error={error}
        buttonText="Prøv igjen"
        onClick={doFetchData}
      />
    );
  }

  return (
    <>
      <Tabs defaultValue="testreglar" onChange={handleChange} value={tab}>
        <Tabs.List>
          <Tabs.Tab value="testreglar">Testreglar</Tabs.Tab>
          <Tabs.Tab value="regelsett">Regelsett</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;
