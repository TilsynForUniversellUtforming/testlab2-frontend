import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { formatDateString } from '@common/util/stringutils';
import { Paragraph, Spinner } from '@digdir/designsystemet-react';
import styles from './loeysing-test.module.css';

interface Props {
  sistLagra: string;
  isLoading: boolean;
}

const SistLagra = ({ sistLagra, isLoading }: Props) => (
  <div className={styles.sistLagra}>
    <ConditionalComponentContainer
      condition={isLoading}
      conditionalComponent={<Spinner data-size="sm" aria-label="Lagrer..." />}
      otherComponent={
        <Paragraph data-size="xs">
          Sist lagra: {formatDateString(sistLagra, true)}
        </Paragraph>
      }
    />
  </div>
);

export default SistLagra;
