import { ElementResultat } from "@test/api/types";
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
  onSetSideUtfall: (status: ElementResultat, testregelId: number,sideId:number) => void;
}

const TestregelButtonList = ({
  row,
  activeTest,
  onChangeTestregel,
  onChangeStatus,
  onSetSideUtfall,
}: Props) => {
  return (
    <div className="testregel-container">
      {row.map((tr) => (
        <TestregelButton
          isActive={tr.testregelId === Number(activeTest?.testregel.id)}
          key={tr.testregelId}
          testregel={tr}
          sideId={tr.sideutvalId}
          onClick={onChangeTestregel}
          status={tr.status}
          onChangeStatus={onChangeStatus}
          onSetSideUtfall={onSetSideUtfall}
        />
      ))}
    </div>
  );
};

export default TestregelButtonList;
