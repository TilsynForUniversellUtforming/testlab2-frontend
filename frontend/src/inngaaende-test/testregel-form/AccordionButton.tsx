import classes from './test-form-accordion.module.css';
import classNames from 'classnames';



import {
  resultatFromSkjemaMedSvar,
  SkjemaMedSvar,
} from '@test/testregel-form/types';
import { elementOmtaleSide, ElementResultat } from '@test/api/types';
import { ArrowDownIcon } from '@navikt/aksel-icons';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';

type AccordionButtonProps = {
  skjemaMedSvar: SkjemaMedSvar;
  resultatId: number;
  elementOmtale: string | undefined;
  kommentar: string | undefined;
  index: number;
  showForm: Record<number, boolean>;
  toggleForm: (resultatId: number) => void;

};


export const AccordionButton = ({
  skjemaMedSvar,
  resultatId,
  elementOmtale,
  kommentar,
  index,
  showForm,
  toggleForm
}: Readonly<AccordionButtonProps>) => {
  const resultat = resultatFromSkjemaMedSvar(skjemaMedSvar);
  const label =
    (elementOmtale === elementOmtaleSide && kommentar) || elementOmtale;



  return (
    <button
      type={'button'}
      className={classes.accordionButton}
      onClick={() => toggleForm(resultatId)}
    >
      <ArrowDownIcon
        className={classNames(classes.arrow, {
          [classes.arrowRotated]: showForm[resultatId],
        })}
      />
      <span className={classes.labelNumber}>
        {elementOmtale ? index + 1 + ': ' : index + 1}
      </span>
      {label}
      <TestlabStatusTag<ElementResultat>
        className={classes.resultat}
        status={resultat}
        colorMapping={{
          danger: ['brot'],
          success: ['samsvar'],
          warning: ['advarsel'],
          info: ['ikkjeForekomst', 'ikkjeTesta'],
        }}
        data-size="md"
      />
    </button>
  );
};
