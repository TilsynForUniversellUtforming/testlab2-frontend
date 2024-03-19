import { Heading, Ingress } from '@digdir/designsystemet-react';
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
    <Heading size="xlarge" level={1} className="heading" spacing>
      {heading}
    </Heading>
    {description && (
      <Ingress level={3} role="doc-subtitle">
        {description}
      </Ingress>
    )}
  </header>
);

export default TestlabFormHeader;
