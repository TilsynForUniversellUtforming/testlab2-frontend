import LoadingBar from '@common/loading-bar/LoadingBar';
import { Heading } from '@digdir/design-system-react';

interface Props {
  pageType: string;
  innhaldstype: string;
  progressionPercent: number;
  // allNonRelevant: boolean;
  // toggleAllNonRelevant: () => void;
}

const TestRegelParamSelection = ({
  pageType,
  innhaldstype,
  progressionPercent,
  // allNonRelevant,
  // toggleAllNonRelevant,
}: Props) => {
  return (
    <div className="test-param-selection">
      <Heading size="small" level={6}>
        {innhaldstype} og {pageType}
      </Heading>
      {/*<Switch*/}
      {/*  position="left"*/}
      {/*  size="small"*/}
      {/*  checked={allNonRelevant}*/}
      {/*  onChange={toggleAllNonRelevant}*/}
      {/*>*/}
      {/*  Ikkje relevant for denne testen*/}
      {/*</Switch>*/}
      <LoadingBar
        ariaLabel={`${progressionPercent}% ferdig`}
        customText="Progresjon"
        dynamicSeverity={false}
        severity="success"
        labelPlacement="right"
        percentage={progressionPercent}
      />
    </div>
  );
};

export default TestRegelParamSelection;
