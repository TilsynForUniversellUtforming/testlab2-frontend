import './hamburger-menu.scss';

import { ButtonColor, ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';

export interface Props {
  open: boolean;
  onClick: () => void;
}

const HamburgerMenu = ({ open, onClick }: Props) => {
  return (
    <Button
      className={classNames('hamburger', { open: open })}
      variant={ButtonVariant.Quiet}
      color={ButtonColor.Inverted}
      onClick={onClick}
      aria-expanded={open}
      title="Meny for verktøy"
      aria-label="Meny for verktøy"
      icon={true}
    >
      <div className="icon-container">
        <MenuHamburgerIcon className="menu-icon" />
        <XMarkIcon className="x-icon" />
      </div>
    </Button>
  );
};

export default HamburgerMenu;
