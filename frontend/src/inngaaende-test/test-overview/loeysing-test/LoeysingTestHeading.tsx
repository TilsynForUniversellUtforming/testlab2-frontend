import { memo } from 'react';
import { Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

export interface Props {
  title: string;
  currentLoeysingName: string;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalList: PageType[];
  sideutval: PageType;
  onChangeSideutval: (sideutvalId: number) => void;
  innhaldstype: InnhaldstypeTesting;
  onChangeInnhaldstype: (innhaldstypeId: number) => void;
  testgrunnlagId: number;
  currentLoeysingId?: number;
  currentSideutvalId?: number;
}

const LoeysingTestHeading = ({
  title,
  currentLoeysingName,
  sideutvalList,
  sideutval,
  onChangeSideutval,
  innhaldstype,
  onChangeInnhaldstype,
  innhaldstypeList,
  testgrunnlagId,
  currentLoeysingId,
  currentSideutvalId
}: Props) => {
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
          {currentLoeysingName} loeysingId: {currentLoeysingId}
        </Tag>
      </div>
      <PageTypeSelector
        sideutvalList={sideutvalList}
        sideutvalId={sideutval.sideId}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstypeId={innhaldstype.id}
        onChangeType={onChangeInnhaldstype}
      />
    </div>
  );
};

export default memo(LoeysingTestHeading);
