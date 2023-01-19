import diskusjonImg from '../assets/diskusjon.svg';
import kravImg from '../assets/krav.png';
import loeysingImg from '../assets/loeysingar.svg';
import maalingImg from '../assets/maaling.svg';
import sakerImg from '../assets/saker.png';
import teknikkarImg from '../assets/teknikkar.png';
import testingImg from '../assets/testreglar.svg';
import verksemderImg from '../assets/verksemder.svg';
import AppTitle from '../common/app-title/AppTitle';
import paths from '../common/paths';
import Lenker from './lenker/Lenker';

const VerktoeyLenker = () => (
  <>
    <AppTitle title="Verktøy" overview />
    <Lenker>
      <Lenker.Lenke pathType={paths.SAKER} img={sakerImg} />
      <Lenker.Lenke pathType={paths.MAALING} img={maalingImg} />
      <Lenker.Lenke pathType={paths.TESTREGLAR} img={testingImg} />
      <Lenker.Lenke pathType={paths.VERKSEMDER} img={verksemderImg} />
      <Lenker.Lenke pathType={paths.LOEYSINGAR} img={loeysingImg} />
      <Lenker.Lenke pathType={paths.KRAV} img={kravImg} />
      <Lenker.Lenke pathType={paths.TEKNIKKAR} img={teknikkarImg} />
      <Lenker.Lenke pathType={paths.DISKUSJON} img={diskusjonImg} />
    </Lenker>
  </>
);

export default VerktoeyLenker;
