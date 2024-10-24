import { Button } from '@digdir/designsystemet-react';

interface ActionLabel {
  activate: string;
  deactivate?: string;
}

export interface TableActionsProps {
  actionFunction: () => void;
  actionsLabel?: ActionLabel;
  isActive?: boolean;
}

const ResultTableActions = (reportProps: TableActionsProps) => {
  const { actionFunction, actionsLabel, isActive } = reportProps;

  return (
    <>
      <div className={'resultat-actions'}>
        <Button variant="primary" onClick={actionFunction}>
          {!isActive ? actionsLabel?.activate : actionsLabel?.deactivate}
        </Button>
      </div>
    </>
  );
};

export default ResultTableActions;
