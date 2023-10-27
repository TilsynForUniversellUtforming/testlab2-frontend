import { Accordion } from '@digdir/design-system-react';
import { SakContext, SakFormState } from '@sak/types';
import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import ConfirmationAccordionList from './ConfirmationAccordionList';

interface SakConfirmContentProps {
  maalingFormState: SakFormState;
}

const SakConfirmContent = ({ maalingFormState }: SakConfirmContentProps) => {
  const { advisors }: SakContext = useOutletContext();

  const {
    navn,
    sakType,
    sakNumber,
    advisorId,
    loeysingList,
    utval,
    testregelList,
  } = maalingFormState;

  const [sakItems, loeysingListItems, utvalListItems, testregelItems] =
    useMemo(() => {
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

      const utvalListItems = utval
        ? [{ id: utval.id, header: utval.namn, text: '' }]
        : [];

      const testregelItems =
        testregelList.map((tr) => ({
          id: tr.id,
          header: `${tr.testregelNoekkel} - ${tr.kravTilSamsvar}`,
          text: tr.krav,
        })) ?? [];

      return [sakItems, loeysingListItems, utvalListItems, testregelItems];
    }, []);

  return (
    <div className="sak-confirm">
      <Accordion color="neutral">
        <ConfirmationAccordionList
          open
          hideNumbering
          accordionHeader="Om saka"
          listItems={sakItems}
        />

        {loeysingListItems.length > 0 && (
          <ConfirmationAccordionList
            accordionHeader={`Løysingar (${loeysingListItems.length})`}
            listItems={loeysingListItems}
          />
        )}

        {utvalListItems.length > 0 && (
          <ConfirmationAccordionList
            accordionHeader="Utval"
            listItems={utvalListItems}
          />
        )}

        <ConfirmationAccordionList
          accordionHeader={`Testreglar (${testregelItems.length})`}
          listItems={testregelItems}
        />
      </Accordion>
    </div>
  );
};

export default SakConfirmContent;
