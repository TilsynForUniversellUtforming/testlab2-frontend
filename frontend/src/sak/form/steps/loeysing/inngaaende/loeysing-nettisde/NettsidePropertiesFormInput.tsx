import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import {
  nettsidePropertyOptions,
  NettsidePropertyType,
} from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { SakFormState } from '@sak/types';
import { useEffect, useState } from 'react';
import { Path, useFormContext, useWatch } from 'react-hook-form';

interface Props {
  isWeb: boolean;
  onClickAdd: () => void;
  nextPropertyPath: Path<SakFormState>;
  nameType: Path<SakFormState>;
  nameUrl: Path<SakFormState>;
  nameReason: Path<SakFormState>;
  nameDescription: Path<SakFormState>;
}

const NettsidePropertiesFormInput = ({
  isWeb,
  onClickAdd,
  nextPropertyPath,
  nameType,
  nameUrl,
  nameReason,
  nameDescription,
}: Props) => {
  const [displayDescription, setDisplayDescription] = useState<boolean>(false);
  const { control, setValue } = useFormContext<SakFormState>();

  const type = useWatch<SakFormState>({
    control,
    name: nameType,
  }) as NettsidePropertyType | undefined;

  useEffect(() => {
    setDisplayDescription(!!type && type === 'egendefinert');
  }, [type]);

  const onClickAddType = (type: NettsidePropertyType) => {
    setValue(nextPropertyPath, {
      type: type,
      url: '',
      reason: undefined,
      description: undefined,
    });
    onClickAdd();
  };

  return (
    <div className="sak-loeysing__nettsted-props-entry">
      <TestlabFormSelect
        label="Velg sidetype"
        options={nettsidePropertyOptions}
        name={nameType}
      />
      {isWeb && (
        <TestlabFormInput<SakFormState>
          label="Url til side"
          name={nameUrl}
          required
        />
      )}
      <TestlabFormInput<SakFormState>
        label="Begrunnelse for sidevalg"
        name={nameReason}
        required
      />
      {displayDescription && (
        <TestlabFormInput<SakFormState>
          label="Beskrivelse av siden"
          name={nameDescription}
          required
        />
      )}
      {type && (
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          onClick={() => onClickAddType(type)}
          icon={<PlusCircleIcon />}
        >
          Legg til side av type {type}
        </Button>
      )}
    </div>
  );
};

export default NettsidePropertiesFormInput;
