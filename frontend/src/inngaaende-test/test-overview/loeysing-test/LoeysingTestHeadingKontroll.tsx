import { OptionType } from '@common/types';
import { Heading, Ingress, Tag } from '@digdir/designsystemet-react';
import PageTypeSelector from '@test/test-overview/loeysing-test/page-selector/PageTypeSelector';
import { PageType } from '@test/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

export interface Props {
  title: string;
  currentLoeysingName: string;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalOptionList: OptionType[];
  pageType: PageType;
  onChangePageType: (sideutvalId: string) => void;
  innhaldstype: InnhaldstypeTesting;
  onChangeInnhaldstype: (innhaldstypeId: string) => void;
}

const LoeysingTestHeadingKontroll = ({
  title,
  currentLoeysingName,
  sideutvalOptionList,
  pageType,
  onChangePageType,
  innhaldstype,
  onChangeInnhaldstype,
  innhaldstypeList,
}: Props) => {
  const innhaldstypeOptions = innhaldstypeList.map(({ id, innhaldstype }) => ({
    value: String(id),
    label: innhaldstype,
  }));

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
        nettsideOptions={sideutvalOptionList}
        sideId={String(pageType.sideId)}
        onChangeSide={onChangePageType}
        innhaldstypeOptions={innhaldstypeOptions}
        innhaldstypeId={String(innhaldstype.id)}
        onChangeType={onChangeInnhaldstype}
      />
    </div>
  );
};

export default LoeysingTestHeadingKontroll;
