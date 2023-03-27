import React from 'react';

import TestlabForm from '../../../../common/form/TestlabForm';
import { SakFormState } from '../../../types';

const SakCrawlParameters = () => {
  return (
    <div className="sak-loeysing__crawl-wrapper">
      <div className="sak-loeysing__crawl-input">
        <TestlabForm.FormInput<SakFormState>
          label="Nettsider til sideutval"
          name="maxLinksPerPage"
          formValidation={{
            errorMessage: 'Nettsider må være mellom 10 og 2000',
            validation: {
              required: true,
              min: 10,
              max: 2000,
              pattern: /^[0-9]{2,4}$/i,
            },
          }}
        />
      </div>
      <div className="sak-loeysing__crawl-input">
        <TestlabForm.FormInput<SakFormState>
          label="Nettsider som blir valde frå utval"
          name="numLinksToSelect"
          formValidation={{
            errorMessage: 'Utval må være mellom 10 og 2000',
            validation: {
              required: true,
              min: 10,
              max: 2000,
              pattern: /^[0-9]{2,4}$/i,
            },
          }}
        />
      </div>
    </div>
  );
};

export default SakCrawlParameters;
