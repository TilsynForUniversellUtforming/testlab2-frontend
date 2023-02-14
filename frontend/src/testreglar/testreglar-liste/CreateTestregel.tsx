import React from 'react';

import EditForm from '../../common/edit-form/EditForm';

const CreateTestregel = () => {
  return (
    <EditForm title="Lage testregel" onSubmit={onSubmit}>
      <EditForm.EditInput label="Navn" onChange={handleKravTilSamsvar} />
      <EditForm.EditSelect
        label="Status"
        options={statusOptions}
        onChange={handleStatus}
      />
      <EditForm.EditSelect
        label="Type"
        options={typeOptions}
        onChange={handleType}
      />
      <EditForm.EditInput label="Testregel" onChange={handleReferanseAct} />
      <EditForm.EditSelect
        label="Krav"
        options={kravOptions}
        onChange={handleKrav}
      />
    </EditForm>
  );
};

export default CreateTestregel;
