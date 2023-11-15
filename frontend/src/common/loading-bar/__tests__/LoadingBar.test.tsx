import LoadingBar from '@common/loading-bar/LoadingBar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LoadingBar', () => {
  it('renders correctly with default props', () => {
    render(<LoadingBar ariaLabel="Loading" percentage={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '50'
    );
  });

  it('does not render when show is false', () => {
    render(<LoadingBar ariaLabel="Loading" percentage={50} show={false} />);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('displays custom text when provided', () => {
    render(
      <LoadingBar
        ariaLabel="Loading"
        percentage={50}
        customText="Custom Text"
      />
    );
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies dynamic severity correctly', () => {
    const { rerender } = render(
      <LoadingBar ariaLabel="Loading" percentage={30} dynamicSeverity={true} />
    );
    expect(screen.getByRole('progressbar')).toHaveClass('danger');

    rerender(
      <LoadingBar ariaLabel="Loading" percentage={75} dynamicSeverity={true} />
    );
    expect(screen.getByRole('progressbar')).toHaveClass('warning');
  });

  it('applies fixed severity when dynamicSeverity is false', () => {
    render(
      <LoadingBar
        ariaLabel="Loading"
        percentage={30}
        dynamicSeverity={false}
        severity="success"
      />
    );
    expect(screen.getByRole('progressbar')).toHaveClass('success');
  });
});
