import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import {
  ActiveTest,
  ManuellTestStatus,
  TestregelOverviewElement,
} from '@test/types';
import { toTestregelStatusKey } from '@test/util/testregelUtils';

interface Props {
  row: TestregelOverviewElement[];
  activeTest: ActiveTest | undefined;
  onChangeTestregel: (testregelId: number) => void;
  testStatusMap: Map<string, ManuellTestStatus>;
  testgrunnlagId: string | undefined;
  sideId: number;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
}

const TestregelButtonList = ({
  row,
  activeTest,
  onChangeTestregel,
  testStatusMap,
  testgrunnlagId,
  sideId,
  onChangeStatus,
}: Props) => {
  return (
    <div className="testregel-container">
      {row.map((tr) => (
        <TestregelButton
          isActive={tr.id === Number(activeTest?.testregel.id)}
          key={tr.id}
          testregel={tr}
          onClick={onChangeTestregel}
          status={
            testStatusMap.get(
              toTestregelStatusKey(Number(testgrunnlagId), tr.id, sideId)
            ) ?? 'ikkje-starta'
          }
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default TestregelButtonList;
