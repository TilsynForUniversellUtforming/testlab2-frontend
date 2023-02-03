import { useEffect, useState } from 'react';

import AppTitle from '../common/app-title/AppTitle';
import * as remoteData from '../remote-data';

type maaling = {
  id: number;
  url: string;
};

type feature = { key: string; active: boolean };

const MaalingApp = () => {
  const [maalinger, setMaalinger] = useState<remoteData.t<string, maaling[]>>({
    type: 'NOT_ASKED',
  });
  const [showMaalinger, setShowMaalinger] = useState(false);
  useEffect(() => {
    remoteData.get<maaling[]>('/api/v1/maalinger').then(setMaalinger);
    remoteData
      .get<feature[]>('/api/v1/features')
      .then((features: remoteData.t<string, feature[]>) => {
        if (features.type === 'SUCCESS') {
          const maalinger = features.data.find(
            (feature) => feature.key === 'maalinger'
          );
          setShowMaalinger(maalinger?.active ?? false);
        } else {
          setShowMaalinger(false);
        }
      });
  }, []);
  return (
    <>
      <AppTitle title="Måling" />
      <Maalinger state={maalinger} showMaalinger={showMaalinger} />
    </>
  );
};

interface MaalingerProps {
  state: remoteData.t<string, maaling[]>;
  showMaalinger: boolean;
}

function Maalinger({ state, showMaalinger }: MaalingerProps) {
  if (showMaalinger) {
    return (
      <>
        <h3>Målinger</h3>
        {remoteData.fold(
          state,
          () => (
            <p>Laster...</p>
          ),
          () => (
            <p>Laster...</p>
          ),
          (error) => (
            <p>error</p>
          ),
          (maalinger) => (
            <ol>
              {maalinger.map((maaling) => (
                <li key={maaling.id}>{maaling.url}</li>
              ))}
            </ol>
          )
        )}
      </>
    );
  } else {
    return null;
  }
}

export default MaalingApp;
