import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonColor, ButtonVariant } from '@common/types';
import { formatDateString } from '@common/util/stringutils';
import {
  Button,
  Heading,
  Dialog,
  Paragraph,
} from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Bilde } from '@test/api/types';
import { useRef, useState } from 'react';

interface Props {
  onDeleteBilde?: (bildeId: number) => void;
  bilder: Bilde[];
  heading?: string;
}

const ImageGallery = ({
  onDeleteBilde,
  bilder,
  heading = 'Bilder til resultat',
}: Props) => {
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
      <TestlabDivider />
      {heading && (
        <Heading data-size="sm" level={5}>
          Bilder til resultat
        </Heading>
      )}
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
            {heading && (
              <div className="image-gallery-item__delete">
                <ConfirmModalButton
                  title="Slett bilde"
                  icon
                  onConfirm={() =>
                    onDeleteBilde ? onDeleteBilde(bilde.id) : undefined
                  }
                  message="Vil du slette bildet, dette kan ikkje angrast?"
                  buttonIcon={<XMarkIcon />}
                  color={ButtonColor.Secondary}
                />
              </div>
            )}
          </div>
        ))}
        <Dialog.Trigger>
        <Dialog
          ref={modalRef}
          closedby='any'
          onClose={() => setActiveBilde(undefined)}
          style={{
            maxWidth: '1200px',
            width: 'fit-content',
          }}
        >
          <Heading>Resultat</Heading>
          <Dialog.Block>
            <img src={activeBilde?.bildeURI} alt="" />
            <Paragraph data-size="xs">
              Oppretta {formatDateString(String(activeBilde?.opprettet), true)}
            </Paragraph>
          </Dialog.Block>
        </Dialog>
        </Dialog.Trigger>
      </div>
    </>
  );
};

export default ImageGallery;
