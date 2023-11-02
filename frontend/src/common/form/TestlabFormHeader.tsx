import { Heading } from '@digdir/design-system-react';
import React from 'react';

const TestlabFormHeader = ({
  heading,
  description,
}: {
  heading: string;
  description?: string;
}) => {
  return (
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
};

export default TestlabFormHeader;
