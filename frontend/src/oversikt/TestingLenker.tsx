import mineTestarImg from '../assets/mine_testar.png';
import qualWebImg from '../assets/qualweb.png';
import resultatImg from '../assets/resultat.svg';
import testerImg from '../assets/tester.png';
import AppTitle from '../common/app-title/AppTitle';
import paths from '../common/paths';
import Lenker from './lenker/Lenker';

const TestingLenker = () => (
  <>
    <AppTitle title="Testing" overview />
    <Lenker>
      <Lenker.Lenke pathType={paths.RESULTAT} img={resultatImg} />
      <Lenker.Lenke pathType={paths.TESTER} img={testerImg} />
      <Lenker.Lenke pathType={paths.MINE_TESTER} img={mineTestarImg} />
      <Lenker.Lenke pathType={paths.QUALWEB} img={qualWebImg} />
    </Lenker>
  </>
);

export default TestingLenker;
