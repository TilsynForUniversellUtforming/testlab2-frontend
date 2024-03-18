import { Accordion, ListItem } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import React from 'react';

export type ListItem = {
  id: number;
  header: string;
  text: string;
};

export interface Props {
  accordionHeader: string;
  subtitle?: string;
  listItems: ListItem[];
  open?: boolean;
  hideNumbering?: boolean;
}

const ConfirmationAccordionList = ({
  accordionHeader,
  listItems,
  open = false,
  hideNumbering = false,
}: Props) => (
  <Accordion.Item defaultOpen={open}>
    <Accordion.Header>{accordionHeader}</Accordion.Header>
    <Accordion.Content>
      <ol
        className={classNames('accordion-list', {
          unnumbered: hideNumbering,
        })}
      >
        {listItems.map((li) => (
          <li className="accordion-list__item" key={li.id}>
            <div>{li.header}</div>
            <div className="sak-confirm__muted">{li.text}</div>
          </li>
        ))}
      </ol>
    </Accordion.Content>
  </Accordion.Item>
);

export default ConfirmationAccordionList;
