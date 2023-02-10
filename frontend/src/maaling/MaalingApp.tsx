import './maalingApp.scss';

import { ColumnDef } from '@tanstack/react-table';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import AppTitle from '../common/app-title/AppTitle';
import DigdirTable from '../common/table/DigdirTable';

type Maaling = {
  id: number;
  navn: string;
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
  const maalingerColumns: ColumnDef<Maaling>[] = [
    {
      id: 'ID',
      accessorFn: (row) => row.id,
      enableColumnFilter: false,
    },
    { id: 'Navn', accessorFn: (row) => row.navn, enableColumnFilter: false },
    { id: 'URL', accessorFn: (row) => row.url, enableColumnFilter: false },
  ];

  let maalinger: JSX.Element;
  switch (state.state) {
    case 'fetching-data':
      maalinger = (
        <DigdirTable
          data={[]}
          error={undefined}
          defaultColumns={maalingerColumns}
        />
      );
      break;
    case 'loaded':
      maalinger = (
        <DigdirTable
          data={state.data}
          defaultColumns={maalingerColumns}
          error={undefined}
        />
      );
      break;
    case 'failed':
      maalinger = (
        <DigdirTable
          data={[]}
          defaultColumns={maalingerColumns}
          error={state.error}
        />
      );
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
  const initialForm = { navn: '', url: '' };
  const [form, setForm] = useState(initialForm);

  function clearForm() {
    setForm(initialForm);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetch('/api/v1/maalinger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(clearForm)
      .then(onNewMaaling);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setForm({ ...form, [name]: value });
  }

  return (
    <section>
      <h3>Ny måling</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Navn:</Form.Label>
          <Form.Control
            type="text"
            name="navn"
            value={form.navn}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Lagre
        </Button>
      </Form>
    </section>
  );
}

export default MaalingApp;
