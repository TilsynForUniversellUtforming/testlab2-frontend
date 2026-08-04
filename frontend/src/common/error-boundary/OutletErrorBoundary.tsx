import ErrorCard from '@common/error/ErrorCard';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error?: Error;
}

class OutletErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  handleReset = () => {
    this.setState({ error: undefined });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorCard
          errorHeader="Uventa feil"
          error={this.state.error}
          buttonText="Proev igjen"
          onClick={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default OutletErrorBoundary;
