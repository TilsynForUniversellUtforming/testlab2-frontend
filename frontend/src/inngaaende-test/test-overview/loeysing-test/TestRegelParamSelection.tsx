import LoadingBar from '@common/loading-bar/LoadingBar';
import { isUrl } from '@common/util/validationUtils';
import { Heading, Link, Switch } from '@digdir/design-system-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

interface Props {
  pageType: string;
  innhaldstype: string;
  progressionPercent: number;
  showHelpText: boolean;
  toggleShowHelpText: () => void;
  url: string;
}

const TestRegelParamSelection = ({
  pageType,
  innhaldstype,
  progressionPercent,
  showHelpText,
  toggleShowHelpText,
  url,
}: Props) => (
  <div className="test-param-selection">
    <Heading size="small" level={6} className="test-param-selection__header">
      {innhaldstype} og {pageType}
      {isUrl(url) && (
        <Link href={url} target="_blank" title={`Gå til ${url}`}>
          <ExternalLinkIcon aria-hidden />
        </Link>
      )}
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

export default TestRegelParamSelection;
