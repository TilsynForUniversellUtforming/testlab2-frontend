import { ReactNode } from 'react';

interface Props {
  loading: boolean;
  children: ReactNode;
}

const HideWhenLoading = ({ loading, children }: Props) => {
  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default HideWhenLoading;
