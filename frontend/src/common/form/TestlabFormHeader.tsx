import { Heading } from '@digdir/design-system-react';
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
    <Heading size="xlarge" level={2} className="heading" spacing>
      {heading}
    </Heading>
    {description && (
      <Heading level={3} size="small" role="doc-subtitle">
        {description}
      </Heading>
    )}
  </header>
);

export default TestlabFormHeader;
