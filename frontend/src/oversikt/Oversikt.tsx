import './oversikt.scss';

import TestingLenker from './TestingLenker';
import VerktoeyLenker from './VerktoeyLenker';

const Oversikt = () => {
  return (
    <div className="oversikt">
      <VerktoeyLenker />
      <TestingLenker />
    </div>
  );
};

export default Oversikt;
