import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import EditForm from '../../common/edit-form/EditForm';
import useValidate from '../../common/hooks/useValidate';
import { Option } from '../../common/types';
import { enumToOptions } from '../../common/util/util';
import { Krav } from '../../krav/types';
import { updateTestregel } from '../api/testreglar-api';
import {
  Testregel,
  TestregelEditRequest,
  TestStatus,
  TestType,
} from '../api/types';
import { TestregelContext } from '../types';

export interface Props {
  testregel: Testregel;
  krav: Krav[];
}

const EditTestreglarForm = ({ testregel, krav }: Props) => {
  const { setTestregelList, setLoading, setError }: TestregelContext =
    useOutletContext();

  const navigate = useNavigate();

  const [referanseAct, setReferanseAct] = useState<string | undefined>(
    testregel.referanseAct ?? undefined
  );
  const [kravTilSamsvar, setKravTilSamsvar] = useState<string>(
    testregel.kravTilSamsvar
  );
  const [type, setType] = useState<TestType>(testregel.type);
  const [status, setStatus] = useState<TestStatus>(testregel.status);
  const [kravId, setKravId] = useState<number | undefined>(
    testregel.kravId ?? undefined
  );

  const handleReferanseAct = (e: ChangeEvent<HTMLInputElement>) => {
    setReferanseAct(e.target.value);
  };

  const handleKravTilSamsvar = (e: ChangeEvent<HTMLInputElement>) => {
    setKravTilSamsvar(e.target.value);
  };
  const handleType = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as TestType);
  };
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as TestStatus);
  };
  const handleKrav = (e: ChangeEvent<HTMLSelectElement>) => {
    setKravId(Number(e.target.value));
  };

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const valid = useValidate([
        { value: testregel?.id },
        { value: referanseAct },
        { value: kravTilSamsvar },
        { value: type },
      ]);

      if (!valid) {
        throw new Error('Ugyldig testregel');
      }

      const request: TestregelEditRequest = {
        id: testregel!.id,
        kravId: Number(kravId),
        referanseAct: referanseAct!,
        kravTilSamsvar: kravTilSamsvar!,
        type: type!,
        status: status!,
      };

      const update = async () => {
        const data = await updateTestregel(request);
        setTestregelList(data);
      };

      setLoading(true);
      setError(undefined);

      update()
        .catch((e) => {
          setError(e.message);
        })
        .finally(() => {
          setLoading(false);
          navigate('..');
        });
    },
    [referanseAct, kravTilSamsvar, type, status, kravId]
  );

  const statusOptions: Option[] = enumToOptions(TestStatus);
  const typeOptions: Option[] = enumToOptions(TestType);
  const kravOptions: Option[] = krav.map((k) => ({
    label: k.tittel,
    value: String(k.id),
  }));
  kravOptions.unshift({ label: 'Ingen krav valgt', value: '' });

  return (
    <EditForm title="Endre testregel" onSubmit={onSubmit}>
      <EditForm.EditInput
        label="Navn"
        value={kravTilSamsvar}
        onChange={handleKravTilSamsvar}
      />
      <EditForm.EditSelect
        label="Status"
        options={statusOptions}
        value={status}
        onChange={handleStatus}
      />
      <EditForm.EditSelect
        label="Type"
        options={typeOptions}
        value={type}
        onChange={handleType}
      />
      <EditForm.EditInput
        label="Testregel"
        value={referanseAct}
        onChange={handleReferanseAct}
      />
      <EditForm.EditSelect
        label="Krav"
        options={kravOptions}
        value={kravId}
        onChange={handleKrav}
      />
    </EditForm>
  );
};

export default EditTestreglarForm;
