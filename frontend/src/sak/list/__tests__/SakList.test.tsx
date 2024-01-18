import { SakListeElement } from '@sak/api/types';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import SakList from '../SakList';

describe('SakList', () => {
  async function setup(saker: SakListeElement[]) {
    const routes = [
      { path: '/sak', element: <SakList />, loader: () => saker },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/sak'],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => screen.getByText('Sak 1'));
  }

  test('når ansvarleg=null, så skal vi vise "Ikkje tildelt"', async () => {
    const saker = [
      { id: 1, namn: 'Sak 1', ansvarleg: undefined, frist: '2025-01-01' },
    ];
    await setup(saker);

    expect(screen.queryByText('Ikkje tildelt')).toBeInTheDocument();
  });

  test('når ansvarleg er definert, så skal vi vise navnet til den ansvarlige', async () => {
    const saker = [
      {
        id: 1,
        namn: 'Sak 1',
        ansvarleg: { brukarnamn: 'testesen@digdir.no', namn: 'Test Testesen' },
        frist: '2025-01-01',
      },
    ];
    await setup(saker);

    expect(screen.queryByText('Test Testesen')).toBeInTheDocument();
    expect(screen.queryByText('testesen@digdir.no')).not.toBeInTheDocument();
    expect(screen.queryByText('Ikkje tildelt')).not.toBeInTheDocument();
  });
});
