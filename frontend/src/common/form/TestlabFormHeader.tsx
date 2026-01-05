import { Heading, Paragraph } from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';

/**
 * Main header for the form component
 *
 * @param {string} heading - Heading for the form.
 * @param {string} description - Optional description for the form.
 *
 * @returns {ReactNode}
 */
const TestlabFormHeader = ({
  heading,
  description,
}: {
  heading: string;
  description?: string;
}): ReactNode => (
  <header className="testlab-form__header">
    <Heading data-size="xl" level={1} className="heading">
      {heading}
    </Heading>
    {description && <Paragraph variant="long" role="doc-subtitle">{description}</Paragraph>}
  </header>
);

export default TestlabFormHeader;
