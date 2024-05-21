import TestlabForm from '@common/form/TestlabForm';
import { MaalingFormState } from '@maaling/types';
import React from 'react';

export interface Props {
  displayAdvanced: boolean;
}

const CrawlParameters = ({ displayAdvanced }: Props) => {
  if (displayAdvanced) {
    return (
      <div className="sak__crawl-wrapper">
        <div className="sak__crawl-input">
          <TestlabForm.FormInput<MaalingFormState>
            label="Nettsider til sideutval (brutto-utval)"
            name="maxLenker"
            inputMode="numeric"
          />
        </div>
        <div className="sak__crawl-input">
          <TestlabForm.FormInput<MaalingFormState>
            label="Nettsider som blir valde frå utval (netto-utval)"
            name="talLenker"
            inputMode="numeric"
          />
        </div>
      </div>
    );
  }
};

export default CrawlParameters;
