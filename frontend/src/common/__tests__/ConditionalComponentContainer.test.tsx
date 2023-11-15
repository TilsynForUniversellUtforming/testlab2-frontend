import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ConditionalComponentContainer', () => {
  it('renders the conditional component when condition is true', () => {
    render(
      <ConditionalComponentContainer
        condition={true}
        conditionalComponent={<div>Conditional</div>}
        otherComponent={<div>Other</div>}
      />
    );
    expect(screen.getByText('Conditional')).toBeInTheDocument();
    expect(screen.queryByText('Other')).not.toBeInTheDocument();
  });

  it('renders the other component when condition is false', () => {
    render(
      <ConditionalComponentContainer
        condition={false}
        conditionalComponent={<div>Conditional</div>}
        otherComponent={<div>Other</div>}
      />
    );
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.queryByText('Conditional')).not.toBeInTheDocument();
  });

  it('renders nothing when show is false', () => {
    render(
      <ConditionalComponentContainer
        condition={true}
        show={false}
        conditionalComponent={<div>Conditional</div>}
        otherComponent={<div>Other</div>}
      />
    );
    expect(screen.queryByText('Conditional')).not.toBeInTheDocument();
    expect(screen.queryByText('Other')).not.toBeInTheDocument();
  });
});
