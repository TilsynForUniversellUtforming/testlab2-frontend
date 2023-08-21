import { Heading, Paragraph } from '@digdir/design-system-react';
import React from 'react';

const TestlabFormHeader = ({
  heading,
  subHeading,
  hasRequiredFields,
}: {
  heading: string;
  subHeading?: string;
  hasRequiredFields?: boolean;
}) => {
  return (
    <header className="testlab-form__header">
      <Heading size="large" className="heading">
        {heading}
      </Heading>
      {subHeading && (
        <Paragraph spacing={!hasRequiredFields} role="doc-subtitle">
          {subHeading}
        </Paragraph>
      )}
      {hasRequiredFields && (
        <Paragraph spacing size="xsmall">
          Felter markert med stjerne er obligatoriske
        </Paragraph>
      )}
    </header>
  );
};

export default TestlabFormHeader;
