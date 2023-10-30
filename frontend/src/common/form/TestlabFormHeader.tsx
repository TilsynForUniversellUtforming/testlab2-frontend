import { Heading } from '@digdir/design-system-react';
import React from 'react';

const TestlabFormHeader = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading?: string;
}) => {
  return (
    <header className="testlab-form__header">
      <Heading size="xlarge" level={2} className="heading" spacing>
        {heading}
      </Heading>
      {subHeading && (
        <Heading level={3} size="small" role="doc-subtitle">
          {subHeading}
        </Heading>
      )}
    </header>
  );
};

export default TestlabFormHeader;
