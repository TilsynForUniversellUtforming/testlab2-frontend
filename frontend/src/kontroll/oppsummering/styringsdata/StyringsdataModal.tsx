import { Modal } from '@digdir/designsystemet-react';
import { Styringsdata } from '../types';
import { ButtonSize, ButtonVariant } from '@common/types';

interface Props {
  styringsdata?: Styringsdata;
}

const StyringsdataModal = ({ styringsdata }: Props) => {

  return (
    <Modal.Root>
      <Modal.Trigger size={ButtonSize.Small} variant={ButtonVariant.Outline}>
        {styringsdata ? 'Sjå' : 'Legg til'} styringsdata
      </Modal.Trigger>
      <Modal.Dialog>
        <Modal.Header>
          Vel løsying du vil legge til styringsdata for
        </Modal.Header>
        <Modal.Content>
          Hei
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  )
}

export default StyringsdataModal;