import usePathName from '@common/app-container/hooks/usePathName';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Paragraph } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { Link, useParams } from 'react-router-dom';

import classes from '../kontroll.module.css';
import { steps } from '../types';

const KontrollStepper = () => {
  const pathNameList = usePathName();
  const currentPathName = pathNameList[pathNameList.length - 1].name;
  const { kontrollId } = useParams();

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

  return (
    <nav className={classes.stepper}>
      <ol>
        {Object.values(steps).map((step) => (
          <li
            className={classNames({
              [classes.selected]: currentPathName === step.name,
            })}
            key={step.name}
          >
            {([currentPathName, step.name].includes('Opprett Kontroll') &&
              isNotDefined(kontrollId)) ||
            currentPathName === step.name ? (
              <Paragraph size="small">{step.name}</Paragraph>
            ) : (
              <Link to={getPath(step.relativePath)} relative="path">
                <Paragraph size="small">{step.name}</Paragraph>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default KontrollStepper;
