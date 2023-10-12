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
      <Heading size="xlarge" className="heading" spacing>
        {heading}
      </Heading>
      {subHeading && (
        <Heading level={4} size="medium" spacing role="doc-subtitle">
          {subHeading}
        </Heading>
      )}
    </header>
  );
};

export default TestlabFormHeader;
