import LoadingBar from '@common/loading-bar/LoadingBar';
import { Heading, Switch } from '@digdir/design-system-react';

interface Props {
  pageType: string;
  contentType: string;
  allNonRelevant: boolean;
  toggleAllNonRelevant: () => void;
  progressionPercent: number;
}

const TestRegelParamSelection = ({
  pageType,
  contentType,
  allNonRelevant,
  toggleAllNonRelevant,
  progressionPercent,
}: Props) => {
  return (
    <div className="test-param-selection">
      <Heading size="small" level={6}>
        {contentType} og {pageType}
      </Heading>
      <Switch
        position="left"
        size="small"
        checked={allNonRelevant}
        onChange={toggleAllNonRelevant}
      >
        Ikkje relevant for denne testen
      </Switch>
      <LoadingBar
        ariaLabel={`${progressionPercent}% ferdig`}
        customText="Progressjon"
        dynamicSeverity={false}
        labelPlacement="right"
        percentage={progressionPercent}
      />
    </div>
  );
};

export default TestRegelParamSelection;
