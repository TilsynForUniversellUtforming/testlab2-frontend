import React, {
  createContext,
  useContext,
  useState,
  useMemo
} from 'react';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { Sideutval, SideutvalType } from '../../../kontroll/sideutval/types';
import { ManuellTestStatus, ActiveTest, PageType } from '@test/types';
import { Severity } from '@common/types';
import { toTestregelStatus } from '@test/util/testregelUtils';
import { useTestResults, ProcessData } from './useTestResults';
import { usePageType } from './usePageType';

export interface TestSessionContextType {
  // Global Context IDs
  testgrunnlagId: number;
  loeysingId: number;

  // UI State
  sideId: number;
  setSideId: (id: number) => void;
  innhaldstype: InnhaldstypeTesting;
  setInnhaldstype: (type: InnhaldstypeTesting) => void;
  pageType: PageType;
  pageTypeList: PageType[];
  onChangeSideutval: (sideId: number) => void;

  // Test State
  activeTest: ActiveTest | undefined;
  setActiveTest: React.Dispatch<React.SetStateAction<ActiveTest | undefined>>;
  testResults: ResultatManuellKontroll[];
  testStatusMap: Map<string, ManuellTestStatus>;

  // Callbacks & Actions
  processData: ProcessData;
  raiseAlert: (severity: Severity, title: string, message: string) => void;

}

const TestSessionContext = createContext<TestSessionContextType | null>(null);

/**
 * Hook to access the test session context.
 * Must be used within TestSessionProvider.
 */
export const useTestSession = (): TestSessionContextType => {
  const context = useContext(TestSessionContext);
  if (!context) {
    throw new Error('useTestSession must be used within TestSessionProvider');
  }
  return context;
};

export interface TestSessionProviderProps {
  // Initial data
  testgrunnlagId: number;
  loeysingId: number;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalTypeList: SideutvalType[];
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];

  // Callbacks
  raiseAlert: (severity: Severity, title: string, message: string) => void;

  // Children
  children: React.ReactNode;
}

/**
 * Provider component that manages all test session state.
 * This eliminates prop drilling and centralizes state management.
 */
export const TestSessionProvider: React.FC<TestSessionProviderProps> = ({
  testgrunnlagId,
  loeysingId,
  innhaldstypeList,
  sideutvalTypeList,
  testResultatForLoeysing,
  sideutvalForLoeysing,
  testreglarForLoeysing,
  testKeys,
  raiseAlert,
  children,
}) => {
  // State: Innhaldstype selection
  const [innhaldstype, setInnhaldstype] = useState(innhaldstypeList[0]);

  // State: Test results
  const { testResults, activeTest, setActiveTest, processData } = useTestResults({
    loeysingId,
    testResultatForLoeysing,
  });

  // State: Page/Sideutval selection
  const { pageTypeList, pageType, sideId, onChangeSideutval } = usePageType({
    sideutvalForLoeysing,
    sideutvalTypeList,
    onSideutvalNotFound: () =>
      raiseAlert('danger', 'Kan ikkje velje sideutval', 'Ugyldig sideutval'),
    onSideutvalChanged: () => {
      setActiveTest(undefined);
    },
  });

  // Derived state: Test status map
  const testStatusMap = useMemo(
    () => toTestregelStatus(testreglarForLoeysing, testResults, testgrunnlagId, sideId),
    [testreglarForLoeysing, testResults, testgrunnlagId, sideId]
  );

  // Create context value - memoized to prevent recreating on every render
  const value = useMemo<TestSessionContextType>(
    () => ({
      // Global IDs
      testgrunnlagId,
      loeysingId,

      // UI State
      sideId,
      setSideId: (newSideId: number) => {
        onChangeSideutval(newSideId);
      },
      innhaldstype,
      setInnhaldstype,
      pageType,
      pageTypeList,
      onChangeSideutval,

      // Test State
      activeTest,
      setActiveTest,
      testResults,
      testStatusMap,

      // Callbacks
      processData,
      raiseAlert,
    }),
    [
      testgrunnlagId,
      loeysingId,
      sideId,
      onChangeSideutval,
      innhaldstype,
      pageType,
      pageTypeList,
      activeTest,
      setActiveTest,
      testResults,
      testStatusMap,
      processData,
      raiseAlert,
    ]
  );

  return (
    <TestSessionContext.Provider value={value}>
      {children}
    </TestSessionContext.Provider>
  );
};



