import { Accordion, Spinner } from '@digdir/design-system-react';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

import ErrorCard from '../../../../common/error/ErrorCard';
import { isDefined } from '../../../../common/util/util';
import { TestRegelsett } from '../../../../testreglar/api/types';
import { User } from '../../../../user/api/types';
import { SakFormState } from '../../../types';
import ConfirmationAccordionList from './ConfirmationAccordionList';

interface SakConfirmContentProps {
  regelsettList: TestRegelsett[];
  error: Error | undefined;
  loading: boolean;
  maalingFormState: SakFormState;
  formErrors?: FieldErrors<SakFormState>;
  advisors: User[];
}

const SakConfirmContent = ({
  error,
  loading,
  maalingFormState,
  formErrors,
  advisors,
}: SakConfirmContentProps) => {
  const { navn, sakType, sakNumber, advisorId, loeysingList, testregelList } =
    maalingFormState;

  if (loading) {
    return <Spinner title="Hentar sak" variant="default" />;
  }

  if (error) {
    return (
      <div className="sak-confirm">
        <ErrorCard error={error} />
      </div>
    );
  }

  const sakError = [
    formErrors?.navn,
    formErrors?.sakType,
    formErrors?.advisorId,
  ]
    .map((e) => e?.message)
    .filter(isDefined)
    .join(', ');
  const loeysingError = formErrors?.loeysingList;
  const testregelError = formErrors?.testregelList;

  const advisorName =
    advisors.find((a) => a.id === Number(advisorId))?.name ?? '';

  const sakItems = [
    {
      id: 1,
      header: 'Namn',
      text: navn ?? '',
    },
    {
      id: 2,
      header: 'Sakstype',
      text: sakType ?? '',
    },
    {
      id: 3,
      header: 'Sakshandsamar',
      text: advisorName,
    },
  ];

  if (sakNumber) {
    sakItems.push({
      id: 4,
      header: 'Saksnummer',
      text: sakNumber,
    });
  }

  const loeysingListItems = loeysingList.map((lo) => ({
    id: lo.loeysing.id,
    header: `Løysing: ${lo.loeysing.namn} - Ansvarleg verksemd: ${lo.verksemd.namn}`,
    text: lo.loeysing.url,
  }));

  const testregelItems =
    testregelList.map((tr) => ({
      id: tr.id,
      header: `${tr.testregelNoekkel} - ${tr.kravTilSamsvar}`,
      text: tr.krav,
    })) ?? [];

  return (
    <div className="sak-confirm">
      <Accordion color="neutral">
        <ConfirmationAccordionList
          open
          hideNumbering
          accordionHeader="Om saka"
          listItems={sakItems}
          errorMessage={sakError.length > 0 ? sakError : undefined}
        />

        <ConfirmationAccordionList
          accordionHeader={`Løysingar (${loeysingListItems.length})`}
          listItems={loeysingListItems}
          errorMessage={loeysingError?.message}
        />

        <ConfirmationAccordionList
          accordionHeader={`Testreglar (${testregelItems.length})`}
          listItems={testregelItems}
          errorMessage={testregelError?.message}
        />
      </Accordion>
    </div>
  );
};

export default SakConfirmContent;
