import { memo } from 'react';
import { Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';

export interface Props {
  title: string;
  currentLoeysingName: string;
  innhaldstypeList: InnhaldstypeTesting[];
  onChangeInnhaldstype: (innhaldstypeId: number) => void;
}

const LoeysingTestHeading = ({
  title,
  currentLoeysingName,
  onChangeInnhaldstype,
  innhaldstypeList,
}: Props) => {
  const {
    pageType,
    pageTypeList,
    loeysingId,
    testgrunnlagId,
    innhaldstype,
    onChangeSideutval,
  } = useTestSession();

  return (
    <div className="manual-test-heading">
      <Heading data-size="xl" level={2}>
        Gjennomfør test
      </Heading>
      <Paragraph variant={'long'}>
        {title} TestgrunnlagId:{testgrunnlagId}
      </Paragraph>
      <div className="tags">
        <Tag color="second">Inngående kontroll</Tag>
        <Tag color="second">Nettside</Tag>
        <Tag color="second">
          {currentLoeysingName} loeysingId: {loeysingId}
        </Tag>
      </div>
      <PageTypeSelector
        sideutvalList={pageTypeList}
        sideutvalId={pageType.sideId}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstypeId={innhaldstype.id}
        onChangeType={onChangeInnhaldstype}
      />
    </div>
  );
};

export default memo(LoeysingTestHeading);
