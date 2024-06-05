import { ButtonVariant } from '@common/types';
import { formatDateString } from '@common/util/stringutils';
import { Button, Modal, Paragraph } from '@digdir/designsystemet-react';
import { Bilde } from '@test/api/types';
import { useRef, useState } from 'react';

interface Props {
  bilder: Bilde[];
}

const ImageGalleryResults = ({ bilder }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [activeBilde, setActiveBilde] = useState<Bilde | undefined>();

  const handleOpenModal = (bilde: Bilde) => {
    setActiveBilde(bilde);
    modalRef.current?.showModal();
  };

  if (bilder.length === 0) {
    return null;
  }

  return (
    <>
      <div className="image-gallery">
        {bilder.map((bilde, index) => (
          <div className="image-gallery-item" key={bilde.thumbnailURI}>
            <Button
              variant={ButtonVariant.Quiet}
              onClick={() => handleOpenModal(bilde)}
              title="Trykk for å se full storleik"
              icon
              size="large"
              asChild
            >
              <img src={bilde.thumbnailURI} alt={`Bilde nr. ${index + 1}`} />
            </Button>
          </div>
        ))}
        <Modal
          ref={modalRef}
          onInteractOutside={() => modalRef.current?.close()}
          onClose={() => setActiveBilde(undefined)}
          style={{
            maxWidth: '1200px',
            width: 'fit-content',
          }}
        >
          <Modal.Header>Resultat</Modal.Header>
          <Modal.Content>
            <img src={activeBilde?.bildeURI} alt="" />
            <Paragraph size="xsmall">
              Oppretta {formatDateString(String(activeBilde?.opprettet), true)}
            </Paragraph>
          </Modal.Content>
        </Modal>
      </div>
    </>
  );
};

export default ImageGalleryResults;
