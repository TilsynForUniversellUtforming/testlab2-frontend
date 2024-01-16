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
    verksemdLoeysingRelation,
  } = maalingFormState;

  const [sakItems, loeysingListItems, utvalListItems, testregelItems] =
    useMemo(() => {
      const advisorName =
        advisors.find((a) => a.id === Number(advisorId))?.name ?? '';

      const isForenklet = sakType === 'Forenklet kontroll';

      const inngaanendeVerkemdNamn = isForenklet
        ? ''
        : verksemdLoeysingRelation?.verksemd?.namn ||
          verksemdLoeysingRelation?.manualVerksemd?.namn ||
          '';

      const sakItems = isForenklet
        ? [
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
          ]
        : [
            {
              id: 1,
              header: 'Namn',
              text: `Kontroll ${
                verksemdLoeysingRelation?.verksemd?.namn
              } ${new Date().getFullYear()}`,
            },
            {
              id: 2,
              header: 'Sakstype',
              text: sakType ?? '',
            },
          ];

      if (sakNumber) {
        sakItems.push({
          id: 4,
          header: 'Saksnummer',
          text: sakNumber,
        });
      }

      const loeysingListItems = isForenklet
        ? loeysingList.map((lo) => ({
            id: lo.loeysing.id,
            header: `Løysing: ${lo.loeysing.namn} - Ansvarleg verksemd: ${lo.verksemd.namn}`,
            text: lo.loeysing.url,
          }))
        : verksemdLoeysingRelation?.loeysingList.map((lo) => ({
            id: lo.loeysing.id,
            header: `Løysing: ${lo.loeysing.namn} - Ansvarleg verksemd: ${inngaanendeVerkemdNamn}`,
            text: lo.loeysing.url,
          })) || [];

      const utvalListItems = utval
        ? [{ id: utval.id, header: utval.namn, text: '' }]
        : [];

      const testregelItems =
        testregelList.map((tr) => ({
          id: tr.id,
          header: tr.name,
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
