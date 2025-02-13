import './navigation.scss';

import { ButtonVariant } from '@common/types';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import { anna, ROOT, saksbehandling, testing, utval } from '../../AppRoutes';
import TestlabLinkButton from '../button/TestlabLinkButton';
import NavigationLinksDropdown from '../dropdown/NavigationLinksDropdown';
import { useEffectOnce } from '../hooks/useEffectOnce';
import HamburgerMenu from './hamburger-menu/HamburgerMenu';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffectOnce(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className="navigation" ref={navRef}>
      <div className="home">
        <TestlabLinkButton
          title=""
          route={ROOT}
          className="link"
          icon={true}
          variant={ButtonVariant.Quiet}
        >
          <img src={ROOT.imgSrc} alt={'Heim'} style={{ width: '100%' }} />
        </TestlabLinkButton>
        <HamburgerMenu open={open} onClick={() => setOpen((open) => !open)} />
      </div>
      <div className={classNames('navigation__list', { open: open })}>
        <div className="navigation__item">
          <NavigationLinksDropdown navn="Utval" routes={utval} />
        </div>
        <div className="navigation__item">
          <NavigationLinksDropdown
            navn="Saksbehandling"
            routes={saksbehandling}
          />
        </div>
        <div className="navigation__item">
          <NavigationLinksDropdown navn="Testing" routes={testing} />
        </div>
        <div className="navigation__item">
          <NavigationLinksDropdown navn="Anna" routes={anna} />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
