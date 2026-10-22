import { ResultatManuellKontroll } from '@test/api/types';

const TestOverviewResultList = ({ testresultList }: TestOverviewResultListProps) => {
  return (
    <div>
      <h2>Test Overview Result List</h2>
      {/* Add your test overview result list content here */}
    </div>
  );
};

interface TestOverviewResultListProps {
  testresultList: ResultatManuellKontroll[];
}

export default TestOverviewResultList;