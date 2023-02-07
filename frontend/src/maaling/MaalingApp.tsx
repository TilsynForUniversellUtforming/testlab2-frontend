import './maalingApp.scss';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

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

  function fetchMaalinger() {
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
  }

  useEffect(() => {
    fetchMaalinger();

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
    (showMaalinger && (
      <>
        <AppTitle title="Måling" />
        <NyMaaling onNewMaaling={fetchMaalinger} />
        <Maalinger state={state} />
      </>
    )) || <AppTitle title="Måling" />
  );
};

interface MaalingerProps {
  state: State;
}

function Maalinger({ state }: MaalingerProps) {
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
    <section>
      <h3>Målinger</h3>
      {maalinger}
    </section>
  );
}

interface NyMaalingProps {
  onNewMaaling: () => void;
}

function NyMaaling({ onNewMaaling }: NyMaalingProps) {
  const [form, setForm] = useState({ url: '' });

  function clearForm() {
    setForm({ url: '' });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetch('/api/v1/maalinger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: form.url }),
    })
      .then(clearForm)
      .then(onNewMaaling);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, url: event.currentTarget.value });
  }

  return (
    <section>
      <h3>Ny måling</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Label>URL:</Form.Label>
        <Form.Control
          type="text"
          value={form.url}
          onChange={handleChange}
        ></Form.Control>
        <Button type="submit">Lagre</Button>
      </Form>
    </section>
  );
}

export default MaalingApp;
