import { ButtonVariant } from '@common/types';
import { formatDateString } from '@common/util/stringutils';
import {
  Button,
  Dialog,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { Bilde } from '@test/api/types';
import { useRef, useState } from 'react';
import { Header } from '@tanstack/react-table';

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
    <div className="image-gallery">
      {bilder.map((bilde, index) => (
        <div className="image-gallery-item" key={bilde.thumbnailURI}>
          <Button
            variant={ButtonVariant.Quiet}
            onClick={() => handleOpenModal(bilde)}
            title="Trykk for å se full storleik"
            icon
            data-size="lg"
            asChild
          >
            <img src={bilde.thumbnailURI} alt={`Bilde nr. ${index + 1}`} />
          </Button>
        </div>
      ))}
      <Dialog.TriggerContext
      >
        <Dialog onClose={() => setActiveBilde(undefined)}>
          <Heading>Resultat</Heading>
          <Dialog.Block>
            <img src={activeBilde?.bildeURI} alt="" />
            <Paragraph data-size="xs">
              Oppretta {formatDateString(String(activeBilde?.opprettet), true)}
            </Paragraph>
          </Dialog.Block>
        </Dialog>
      </Dialog.TriggerContext>
    </div>
  );
};

export default ImageGalleryResults;
