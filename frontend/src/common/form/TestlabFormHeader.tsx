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
      <h2 className="heading">{heading}</h2>
      {subHeading && (
        <p role="doc-subtitle" className="sub-heading">
          {subHeading}
        </p>
      )}
    </header>
  );
};

export default TestlabFormHeader;
