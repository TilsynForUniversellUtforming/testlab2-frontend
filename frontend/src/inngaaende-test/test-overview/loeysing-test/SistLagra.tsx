import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { formatDateString } from '@common/util/stringutils';
import { Paragraph, Spinner } from '@digdir/designsystemet-react';

interface Props {
  sistLagra: string;
  isLoading: boolean;
}

const SistLagra = ({ sistLagra, isLoading }: Props) => (
  <div className="sist-lagra">
    <ConditionalComponentContainer
      condition={isLoading}
      conditionalComponent={<Spinner size="small" title="Lagrer..." />}
      otherComponent={
        <Paragraph size="xs">
          Sist lagra: {formatDateString(sistLagra, true)}
        </Paragraph>
      }
    />
  </div>
);

export default SistLagra;
