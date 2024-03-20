import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonColor, ButtonVariant } from '@common/types';
import { Button, Heading, Modal } from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Bilde } from '@test/api/types';
import { useRef, useState } from 'react';

interface Props {
  onDeleteBilde: (bildeId: number) => void;
  bilder: Bilde[];
}

const ImageGallery = ({ onDeleteBilde, bilder }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [largeImage, setLargeImage] = useState<string | undefined>();

  const handleOpenModal = (img: string) => {
    setLargeImage(img);
    modalRef.current?.showModal();
  };

  if (bilder.length === 0) {
    return null;
  }

  return (
    <>
      <TestlabDivider />
      <Heading size="small" level={5} spacing>
        Bilder til resultat
      </Heading>
      <div className="image-gallery">
        {bilder.map((bilde, index) => (
          <div className="image-gallery-item" key={bilde.thumbnailURI}>
            <Button
              variant={ButtonVariant.Quiet}
              onClick={() => handleOpenModal(bilde.bildeURI)}
              title="Trykk for å se full storleik"
              icon
              size="large"
              asChild
            >
              <img src={bilde.thumbnailURI} alt={`Bilde nr. ${index + 1}`} />
            </Button>
            <div className="image-gallery-item__delete">
              <ConfirmModalButton
                title="Slett bilde"
                icon
                onConfirm={() => onDeleteBilde(bilde.id)}
                message="Vil du slette bildet, dette kan ikkje angrast?"
                buttonIcon={<XMarkIcon />}
                color={ButtonColor.Secondary}
              />
            </div>
          </div>
        ))}
        <Modal
          ref={modalRef}
          onInteractOutside={() => modalRef.current?.close()}
          onClose={() => setLargeImage(undefined)}
          style={{
            maxWidth: '1200px',
            width: 'fit-content',
          }}
        >
          <Modal.Header>Resultat</Modal.Header>
          <Modal.Content>
            <img src={largeImage} alt="" />
          </Modal.Content>
        </Modal>
      </div>
    </>
  );
};

export default ImageGallery;
