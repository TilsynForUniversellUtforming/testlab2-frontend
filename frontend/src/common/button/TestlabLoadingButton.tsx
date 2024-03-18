import { Button, Spinner } from '@digdir/designsystemet-react';

export interface Props {
  title: string;
  loadingText?: string;
  onClick: () => void;
  loading?: boolean;
}

const TestlabLoadingButton = ({
  title,
  loadingText,
  onClick,
  loading = false,
}: Props) => {
  const handleOnClick = (e: React.MouseEvent, onClick: () => void) => {
    if (loading) {
      e.preventDefault();
      return;
    } else {
      onClick();
    }
  };

  const loadingTitle = loadingText ?? 'Laster...';

  return (
    <Button onClick={(e) => handleOnClick(e, onClick)} aria-disabled={loading}>
      {loading && <Spinner title={loadingTitle} variant="interaction" />}
      {loading ? loadingTitle : title}
    </Button>
  );
};

export default TestlabLoadingButton;
