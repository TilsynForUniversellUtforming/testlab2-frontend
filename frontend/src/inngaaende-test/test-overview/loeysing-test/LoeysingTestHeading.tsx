import { Heading, Ingress, Tag } from '@digdir/designsystemet-react';
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
}: Props) => {
  return (
    <div className="manual-test-heading">
      <Heading spacing size="xlarge" level={2}>
        Gjennomfør test
      </Heading>
      <Ingress spacing>{title}</Ingress>
      <div className="tags">
        <Tag color="second">Inngående kontroll</Tag>
        <Tag color="second">Nettside</Tag>
        <Tag color="second">{currentLoeysingName}</Tag>
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

export default LoeysingTestHeading;
