import { Button } from '@digdir/designsystemet-react';

interface ActionLabel {
  activate: string;
  disable?: string;
}

export interface TableActionsProps {
  actionFunction: () => void;
  actionsLabel?: ActionLabel;
  isActive?: boolean;
}

const ResultTableActions = (reportProps: TableActionsProps) => {
  const { actionFunction, actionsLabel, isActive } = reportProps;

  console.log(
    'ResultTableActions: actionFunction: ' +
      actionFunction +
      ', actionsLabel: ' +
      actionsLabel +
      ', isActive: ' +
      isActive
  );
  // const { id, loeysingId } = useParams();
  //
  // const genererRapport = () => {
  //   genererWordRapport(Number(id), Number(loeysingId));
  // };
  //
  // const publiserRapport = () => {
  //   console.log('Publiserer rapport');
  // };

  return (
    <>
      <div className={'resultat-actions'}>
        <Button variant="primary" onClick={actionFunction}>
          {!isActive ? actionsLabel?.activate : actionsLabel?.disable}
        </Button>
      </div>
    </>
  );
};

export default ResultTableActions;
