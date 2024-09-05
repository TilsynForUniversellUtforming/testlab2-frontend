import { Button } from '@digdir/designsystemet-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

type ButtonText = 'Lagre' | 'Lagrer...' | 'Lagret';

const SaveButton = () => {
  const navigation = useNavigation();
  const [buttonText, setButtonText] = useState<ButtonText>('Lagre');
  const [prevState, setPrevState] = useState(navigation.state);

  useEffect(() => {
    setPrevState(navigation.state);
    if (navigation.state !== 'idle') {
      setButtonText('Lagrer...');
    } else if (navigation.state !== prevState) {
      setButtonText('Lagret');
    } else {
      setButtonText('Lagre');
    }
  }, [navigation.state]);

  return (
    <Button type="submit">
      {buttonText}
      {buttonText === 'Lagret' && <CheckmarkIcon fontSize="1.5rem" />}
    </Button>
  );
};

export default SaveButton;
