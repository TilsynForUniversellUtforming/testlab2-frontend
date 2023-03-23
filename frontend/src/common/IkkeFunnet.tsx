import React from 'react';
import { Link } from 'react-router-dom';

import AppTitle from './app-title/AppTitle';

const IkkeFunnet = () => (
  <div>
    <AppTitle heading="Ikke funnet" />
    <p>
      <Link to="/">Gå til hovedsiden</Link>
    </p>
  </div>
);

export default IkkeFunnet;
