import './lenker.scss';

import React from 'react';

import kravImg from '../../assets/krav.png';
import loeysingImg from '../../assets/loeysingar.svg';
import resultatImg from '../../assets/resultat.svg';
import testingImg from '../../assets/testing.svg';
import { Paths } from '../../common/paths';
import Lenke from './Lenke';

const Lenker = () => {
  return (
    <div className="lenker">
      <Lenke path={Paths.TEST} img={testingImg} tekst="Testing" />
      <Lenke path={Paths.KRAV} img={kravImg} tekst="Krav" />
      <Lenke path={Paths.RESULTAT} img={resultatImg} tekst="Resultat" />
      <Lenke path={Paths.LOEYSINGAR} img={loeysingImg} tekst="Løysingar" />
    </div>
  );
};

export default Lenker;
