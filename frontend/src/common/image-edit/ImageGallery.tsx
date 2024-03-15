import { Button, Modal } from '@digdir/design-system-react';
import { ImageUris } from '@test/api/types';
import { useRef, useState } from 'react';

interface Props {
  fetchImages: () => void;
  imageUris: ImageUris[];
}

const ImageGallery = ({ imageUris, fetchImages }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [largeImage, setLargeImage] = useState<string | undefined>();

  const handleOpenModal = (img: string) => {
    setLargeImage(img);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setLargeImage(undefined);
    modalRef.current?.close();
  };

  if (imageUris.length === 0) {
    return <Button onClick={fetchImages}>Hent bilder</Button>;
  }

  return (
    <>
      {imageUris.map((image) => (
        <button
          key={image.thumbnailURI}
          onClick={() => handleOpenModal(image.imageURI)}
        >
          <img src={image.thumbnailURI} alt="" />
        </button>
      ))}
      <Modal
        ref={modalRef}
        onInteractOutside={handleCloseModal}
        onClose={() => setLargeImage(undefined)}
      >
        <Modal.Header>Resultat</Modal.Header>
        <Modal.Content>
          <img src={largeImage} alt="" />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ImageGallery;
