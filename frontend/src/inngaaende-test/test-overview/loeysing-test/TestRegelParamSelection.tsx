import LoadingBar from '@common/loading-bar/LoadingBar';
import { Heading, Switch } from '@digdir/design-system-react';

interface Props {
  pageType: string;
  innhaldstype: string;
  progressionPercent: number;
  showHelpText: boolean;
  toggleShowHelpText: () => void;
}

const TestRegelParamSelection = ({
  pageType,
  innhaldstype,
  progressionPercent,
  showHelpText,
  toggleShowHelpText,
}: Props) => {
  return (
    <div className="test-param-selection">
      <Heading size="small" level={6}>
        {innhaldstype} og {pageType}
      </Heading>
      <LoadingBar
        ariaLabel={`${progressionPercent}% ferdig`}
        customText="Progresjon"
        dynamicSeverity={false}
        severity="success"
        labelPlacement="right"
        percentage={progressionPercent}
      />
      <Switch
        position="left"
        size="small"
        checked={showHelpText}
        onChange={toggleShowHelpText}
      >
        Hjelpetekster
      </Switch>
    </div>
  );
};

export default TestRegelParamSelection;
