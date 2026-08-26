
import { FormError } from './types';
import { Loeysing } from '@loeysingar/api/types';
import classes from '../kontroll.module.css';
import classNames from 'classnames';
import { ErrorSummary } from '@digdir/designsystemet-react';

export const ButtonSideutvalManuellKontroll = ({
  isForenkla,
}: {
  isForenkla: boolean;
}) => {
  return (
    <button
      type="button"
      className={classNames({
        [classes.selected]: !isForenkla,
      })}
      disabled={isForenkla}
      title={
        isForenkla
          ? 'Manuelt sideutval er ikkje tilgjengelig for forenkla kontroll'
          : 'Vel manuelt'
      }
    >
      Manuelt sideutval
    </button>
  );
};

export const ButtonSideutvalAutomatiskTest = ({
  isForenkla,
}: {
  isForenkla: boolean;
}) => {
  return (
    <button
      type="button"
      className={classNames({
        [classes.selected]: isForenkla,
      })}
      disabled={!isForenkla}
      title={
        isForenkla
          ? 'Vel automatisk'
          : 'Automatisk sideutval er ikkje tilgjengelig for inngåande kontroll'
      }
    >
      Automatisk sideutval
    </button>
  );
};

export const SideutvalErrorSummary = ({
  formErrors,
  loeysingList,
}: {
  formErrors: FormError[];
  loeysingList: Loeysing[];
}) => {
  return (
    <div className={classes.sideutvalLoeysingErrors}>
      <ErrorSummary data-size="md">
        <ErrorSummary.Heading>
          Det er feil med sideutval på føljande løysingar
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          {formErrors.map((formError) => (
            <ErrorSummary.Item
              key={`${formError.loeysingId}_${formError.sideutvalType}`}
            >
              <ErrorSummary.Link href={`#loeysing-${formError.loeysingId}`}>
                {
                  loeysingList.find((ll) => ll.id === formError.loeysingId)
                    ?.namn
                }{' '}
                - {formError.sideutvalType} ({formError.antallFeil} feil)
                - {formError.errorMessage}

              </ErrorSummary.Link>
            </ErrorSummary.Item>
          ))}
        </ErrorSummary.List>
      </ErrorSummary>
    </div>
  );
};