import usePathName from '@common/app-container/hooks/usePathName';
import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import { ButtonColor, ButtonVariant } from '@common/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Button, Paragraph } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from 'react-router-dom';

import classes from '../kontroll.module.css';
import { steps } from '../types';

interface Props {
  step: { name: string; relativePath: string };
  currentPathName: string;
  unselectable: boolean;
  isDirty: boolean;
  navigate: NavigateFunction;
  kontrollId: string | undefined;
}

const KontrollStepperButton = ({
  step,
  currentPathName,
  unselectable,
  isDirty,
  navigate,
  kontrollId,
}: Props) => {
  const getPath = (path: string) => {
    if (
      path === '..' ||
      isNotDefined(kontrollId) ||
      (currentPathName === 'Opprett Kontroll' && isDefined(kontrollId))
    ) {
      return path;
    }
    return `../${path}`;
  };

  if (unselectable) {
    return (
      <Paragraph
        title={currentPathName === step.name ? '' : 'Kontrolldata manglar'}
        size="small"
      >
        {step.name}
      </Paragraph>
    );
  }

  if (isDirty) {
    return (
      <ConfirmModalButton
        size="small"
        title={step.name}
        onConfirm={() =>
          navigate(getPath(step.relativePath), { relative: 'path' })
        }
        message="Det er gjort endringar utan å lagra. Vil du likevel gå vidare?"
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Secondary}
        customHeader="Ikke-lagra endringar"
      />
    );
  }

  return (
    <Link to={getPath(step.relativePath)} relative="path">
      <Button
        size="small"
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Secondary}
        asChild
      >
        <Paragraph size="small">{step.name}</Paragraph>
      </Button>
    </Link>
  );
};

const KontrollStepper = ({ isDirty }: { isDirty: boolean }) => {
  const pathNameList = usePathName();
  const currentPathName = pathNameList[pathNameList.length - 1].name;
  const { kontrollId } = useParams();
  const navigate = useNavigate();

  return (
    <nav className={classes.stepper}>
      <ol>
        {Object.values(steps).map((step) => {
          const unselectable =
            ([currentPathName, step.name].includes('Opprett Kontroll') &&
              isNotDefined(kontrollId)) ||
            currentPathName === step.name;

          return (
            <li
              className={classNames({
                [classes.selected]: currentPathName === step.name,
                [classes.unselectable]: unselectable,
              })}
              key={step.name}
            >
              <KontrollStepperButton
                kontrollId={kontrollId}
                step={step}
                currentPathName={currentPathName}
                unselectable={unselectable}
                isDirty={isDirty}
                navigate={navigate}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default KontrollStepper;
