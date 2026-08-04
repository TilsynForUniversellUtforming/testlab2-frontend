import {
  InnhaldstypeTesting,
  Tema,
  Testobjekt,
  TestregelInnholdstype,
  TestregelModus,
  TestregelStatus,
} from '@testreglar/api/types';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { OptionType } from '@common/types';
import { Krav } from '../../krav/types';

export const defineKravOptions = (kravList: Krav[]) => {
  const kravOptions: OptionType[] = kravList.map((k) => ({
    label: k.tittel,
    value: k.id,
  }));
  return kravOptions;
};
export const defineSpraakOptions = () => {
  const spraakOptions: OptionType[] = [
    { value: 'nn', label: 'Norsk nynorsk' },
    { value: 'nb', label: 'Norsk bokmål' },
    { value: 'en', label: 'Engelsk' },
  ];
  return spraakOptions;
};
export const defineTestregelStatusOption = () => {
  return createOptionsFromLiteral<TestregelStatus>([
    'ikkje_starta',
    'under_arbeid',
    'gjennomgaatt_workshop',
    'klar_for_testing',
    'treng_avklaring',
    'ferdig_testa',
    'klar_for_kvalitetssikring',
    'publisert',
    'utgaar',
  ]);
};
export const defineTypeOptions = () => {
  return createOptionsFromLiteral<TestregelInnholdstype>([
    'app',
    'nett',
    'automat',
    'dokument',
  ]);
};
export const defineInnholdstypeOptions = (innhaldstypeList: InnhaldstypeTesting[]) => {
  const innhaldsTypeOptions: OptionType[] = innhaldstypeList.map((it) => ({
    label: it.innhaldstype,
    value: it.id,
  }));
  return innhaldsTypeOptions;
};
export const defineTemaOptions = (temaList: Tema[]) => {
  const temaOptions: OptionType[] = temaList.map((it) => ({
    label: it.tema,
    value: it.id,
  }));
  return temaOptions;
};
export const deineTestobjectOptions = (testobjektList: Testobjekt[]) => {
  const testobjektOptions: OptionType[] = testobjektList.map((it) => ({
    label: it.testobjekt,
    value: it.id,
  }));
  return testobjektOptions;
};
export const defineModusOptions = () => {
  return createOptionsFromLiteral<TestregelModus>([
    'manuell',
    'automatisk',
    'deque',
    'manuell-forenkla',
  ]).concat({
    label: 'Semi-automatisk',
    value: 'semi-automatisk',
    title: 'Semi-automatiske testreglar er ikkje støtta ennå',
    disabled: true,
  });
};