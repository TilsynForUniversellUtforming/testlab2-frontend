import { ReactNode } from 'react';

interface Props {
  condition: boolean;
  show?: boolean;
  conditionalComponent: ReactNode;
  otherComponent: ReactNode;
}

const ConditionalComponentContainer = ({
  condition,
  show = true,
  conditionalComponent,
  otherComponent,
}: Props) => {
  if (!show) {
    return null;
  }

  if (condition) {
    return <>{conditionalComponent}</>;
  } else {
    return <>{otherComponent}</>;
  }
};

export default ConditionalComponentContainer;
