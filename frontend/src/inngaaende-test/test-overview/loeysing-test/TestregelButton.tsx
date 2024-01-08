import { Button } from '@digdir/design-system-react';
import { TestregelOverviewElement } from '@test/types';

export interface Props {
  testregel: TestregelOverviewElement;
  onChangeTestregel: (testregelId: number) => void;
}

const TestregelButton = ({ onChangeTestregel, testregel }: Props) => {
  return (
    <Button
      onClick={() => {
        onChangeTestregel(testregel.id);
      }}
    >
      {testregel.name}
    </Button>
  );
};

export default TestregelButton;
