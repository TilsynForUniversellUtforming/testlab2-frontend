import {
  ErrorMessage,
  LegacyAccordion,
  LegacyAccordionContent,
  LegacyAccordionHeader,
  ListItem,
} from '@digdir/design-system-react';
import React from 'react';

export type ListItem = {
  id: number;
  header: string;
  text: string;
};

export interface Props {
  onToggle: () => void;
  open: boolean;
  accordionHeader: string;
  subtitle?: string;
  listItems: ListItem[];
  errorMessage?: string;
}

const ConfirmationAccordionList = ({
  onToggle,
  open,
  accordionHeader,
  listItems,
  errorMessage,
}: Props) => {
  if (errorMessage) {
    return (
      <>
        <h4 className="sak-confirm__header">{accordionHeader}</h4>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </>
    );
  }

  return (
    <LegacyAccordion onClick={onToggle} open={open}>
      <LegacyAccordionHeader>{accordionHeader}</LegacyAccordionHeader>
      <LegacyAccordionContent>
        <ol className="accordion-list">
          {listItems.map((li) => (
            <li className="accordion-list__item" key={li.id}>
              <div>{li.header}</div>
              <div className="sak-confirm__muted">{li.text}</div>
            </li>
          ))}
        </ol>
      </LegacyAccordionContent>
    </LegacyAccordion>
  );
};

export default ConfirmationAccordionList;
