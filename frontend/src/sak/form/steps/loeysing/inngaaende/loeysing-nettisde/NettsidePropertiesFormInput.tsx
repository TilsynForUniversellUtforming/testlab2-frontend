import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { ButtonSize, ButtonVariant } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Button } from '@digdir/design-system-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import {
  nettsidePropertyOptions,
  NettsidePropertyType,
} from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { SakFormState } from '@sak/types';
import { useEffect, useState } from 'react';
import { Path, useFormContext, useWatch } from 'react-hook-form';

interface Props {
  isWeb: boolean;
  onClickAdd: (type: NettsidePropertyType) => void;
  onClickRemove: () => void;
  nameType: Path<SakFormState>;
  nameUrl: Path<SakFormState>;
  nameReason: Path<SakFormState>;
  nameDescription: Path<SakFormState>;
}

const NettsidePropertiesFormInput = ({
  isWeb,
  onClickAdd,
  onClickRemove,
  nameType,
  nameUrl,
  nameReason,
  nameDescription,
}: Props) => {
  const [displayDescription, setDisplayDescription] = useState<boolean>(false);
  const { control } = useFormContext<SakFormState>();

  const type = useWatch<SakFormState>({
    control,
    name: nameType,
  }) as NettsidePropertyType | undefined;

  useEffect(() => {
    setDisplayDescription(!!type && type === 'egendefinert');
  }, [type]);

  return (
    <div className="sak-loeysing__nettsted-props-entry">
      <TestlabFormSelect
        label="Velg sidetype"
        options={nettsidePropertyOptions}
        name={nameType}
      />
      {displayDescription && (
        <TestlabFormInput<SakFormState>
          label="Beskrivelse av siden"
          name={nameDescription}
          required
        />
      )}
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
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={onClickRemove}
        icon={<MinusCircleIcon />}
      >
        Fjern side
      </Button>
      {type && (
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          onClick={() => onClickAdd(type)}
          icon={<PlusCircleIcon />}
        >
          Legg til flere sider innen {sanitizeEnumLabel(type)}
        </Button>
      )}
    </div>
  );
};

export default NettsidePropertiesFormInput;
