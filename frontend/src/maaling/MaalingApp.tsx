import { useEffect, useState } from 'react';

import AppTitle from '../common/app-title/AppTitle';

type Maaling = {
  id: number;
  url: string;
};
type FetchingData = { state: 'fetching-data' };
type Loaded = { state: 'loaded'; data: Maaling[] };
type Failed = { state: 'failed'; error: Error };
type State = FetchingData | Loaded | Failed;

type Feature = { key: string; active: boolean };

const MaalingApp = () => {
  const [state, setState] = useState<State>({ state: 'fetching-data' });
  const [showMaalinger, setShowMaalinger] = useState(false);
  useEffect(() => {
    fetch('/api/v1/maalinger')
      .then((res) => {
        if (!res.ok) {
          const error = new Error(`${res.status} ${res.statusText}`);
          setState({ state: 'failed', error });
          throw error;
        } else {
          return res.json();
        }
      })
      .then(
        (maalinger: Maaling[]) => {
          setState({ state: 'loaded', data: maalinger });
        },
        (error) => {
          setState({ state: 'failed', error });
        }
      );

    fetch('/api/v1/features')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        } else {
          return res.json();
        }
      })
      .then(
        (features: Feature[]) => {
          const maalinger = features.find(
            (feature) => feature.key === 'maalinger'
          );
          setShowMaalinger(maalinger?.active ?? false);
        },
        (error) => console.error(error.message)
      );
  }, []);
  return (
    <>
      <AppTitle title="Måling" />
      <Maalinger state={state} showMaalinger={showMaalinger} />
    </>
  );
};

interface MaalingerProps {
  state: State;
  showMaalinger: boolean;
}

function Maalinger({ state, showMaalinger }: MaalingerProps) {
  if (showMaalinger) {
    let maalinger: JSX.Element;
    switch (state.state) {
      case 'fetching-data':
        maalinger = <p>Laster...</p>;
        break;
      case 'loaded':
        maalinger = (
          <ol>
            {state.data.map((maaling) => (
              <li key={maaling.id}>{maaling.url}</li>
            ))}
          </ol>
        );
        break;
      case 'failed':
        maalinger = <p>Feilet: {state.error.message}</p>;
        break;
    }

    return (
      <>
        <h3>Målinger</h3>
        {maalinger}
      </>
    );
  } else {
    return null;
  }
}

export default MaalingApp;
