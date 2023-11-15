import { ReactNode } from 'react';

interface Props {
  condition: boolean;
  show?: boolean;
  conditionalComponent: ReactNode;
  otherComponent: ReactNode;
}

/**
 * Renders either the conditionalComponent or the otherComponent based on the given condition.
 * Can be configured to not render anything by setting the show prop to false.
 * @param {Object} props
 * @param {boolean} props.condition - The condition to determine which component to render.
 * @param {boolean} [props.show=true] - Flag to control the rendering of the container.
 * @param {ReactNode} props.conditionalComponent - Component to render when condition is true.
 * @param {ReactNode} props.otherComponent - Component to render when condition is false.
 * @returns {ReactNode} The selected component based on the condition, or null if show is false.
 */
const ConditionalComponentContainer = ({
  condition,
  show = true,
  conditionalComponent,
  otherComponent,
}: Props): ReactNode => {
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
