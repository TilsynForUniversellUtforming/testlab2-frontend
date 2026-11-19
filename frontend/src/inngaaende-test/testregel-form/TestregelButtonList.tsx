import { ElementResultat } from "@test/api/types";
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import {
  ActiveTest,
  ManuellTestStatus,
  TestregelOverviewElement,
} from '@test/types';
import { toTestregelStatusKey } from '@test/util/testregelUtils';

export interface TestregelButtonListProps {
  testregelOverviewRow: TestregelOverviewElement[];
  activeTest: ActiveTest | undefined;
  onChangeTestregel: (testregelId: number) => void;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  onSetSideUtfall: (status: ElementResultat, testregelId: number,sideId:number) => void;
}

const TestregelButtonList = ({
  testregelOverviewRow,
  activeTest,
  onChangeTestregel,
  onChangeStatus,
  onSetSideUtfall,
}: TestregelButtonListProps) => {


  return (
    <div className="testregel-container">
      {testregelOverviewRow.map((tr) => (
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
