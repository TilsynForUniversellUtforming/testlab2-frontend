import { Heading, Paragraph } from '@digdir/design-system-react';
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
      <Heading size="large" className="heading">
        {heading}
      </Heading>
      {subHeading && (
        <Paragraph spacing role="doc-subtitle">
          {subHeading}
        </Paragraph>
      )}
    </header>
  );
};

export default TestlabFormHeader;
