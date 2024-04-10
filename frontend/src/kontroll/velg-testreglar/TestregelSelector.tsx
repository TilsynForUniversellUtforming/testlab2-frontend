import { Alert } from '@digdir/designsystemet-react';
import { TestregelBase } from '@testreglar/api/types';

interface Props {
  testregelList: TestregelBase[];
  selectedTestregelIdList: number[];
  onSelectTestregelId: (testregelId: number) => void;
}

const TestregelSelector = ({
  testregelList,
  // selectedTestregelIdList,
  // onSelectTestregelId,
}: Props) => {
  if (testregelList.length === 0) {
    return (
      <Alert severity="info">
        Ingen testrelgar for valgt type tilgjengelig
      </Alert>
    );
  }

  return <></>;
};

export default TestregelSelector;
