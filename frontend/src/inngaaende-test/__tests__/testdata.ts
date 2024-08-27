import { faker } from '@faker-js/faker';
import {
  ElementResultat,
  ResultatManuellKontroll,
  ResultatStatus,
} from '@test/api/types';
import { Testgrunnlag } from '@test/types';
import { Testregel } from '@testreglar/api/types';

import { Sideutval } from '../../kontroll/sideutval/types';
import { createKrav } from '../../krav/__tests__/testdata';

export function createOpprinneligTest(): Testgrunnlag {
  return {
    id: faker.number.int(),
    kontrollId: faker.number.int(),
    namn: faker.lorem.word(),
    testreglar: faker.helpers.multiple(createTestregel),
    sideutval: faker.helpers.multiple(createSideutval),
    type: 'OPPRINNELIG_TEST',
    datoOppretta: faker.date.past().toISOString(),
  };
}

export function createRetest(forrigeTest: Testgrunnlag): Testgrunnlag {
  return {
    ...forrigeTest,
    id: faker.number.int({
      min: forrigeTest.id + 1,
      max: forrigeTest.id + 1000,
    }),
    namn: `retest: ${forrigeTest.namn}`,
    type: 'RETEST',
    sideutval: [faker.helpers.arrayElement(forrigeTest.sideutval)],
    datoOppretta: faker.date
      .between({
        from: forrigeTest.datoOppretta,
        to: new Date(),
      })
      .toISOString(),
  };
}

function createTestregel(): Testregel {
  return {
    id: faker.number.int(),
    namn: faker.lorem.word(),
    krav: createKrav(),
    modus: faker.helpers.arrayElement([
      'automatisk',
      'manuell',
      'semi-automatisk',
    ]),
    type: faker.helpers.arrayElement(['app', 'automat', 'dokument', 'nett']),
    testregelId: faker.string.uuid(),
    versjon: faker.number.int(),
    status: 'publisert',
    datoSistEndra: faker.date.past().toISOString(),
    spraak: faker.helpers.arrayElement(['en', 'nb', 'nn']),
    testregelSchema: '',
  };
}

function createSideutval(): Sideutval {
  return {
    id: faker.number.int(),
    loeysingId: faker.number.int(),
    typeId: faker.number.int(),
    begrunnelse: faker.lorem.words(),
    url: faker.internet.url(),
  };
}

export function createResultatManuellKontrollForLoeysing(
  testgrunnlag: Testgrunnlag,
  loeysingId: number,
  status: ResultatStatus,
  elementResultat?: ElementResultat
): ResultatManuellKontroll[] {
  return [
    ...Array(
      testgrunnlag.sideutval.filter((su) => su.loeysingId === loeysingId)
        .length * testgrunnlag.testreglar.length
    ),
  ].map((_, idx) =>
    createResultatManuellKontroll(
      testgrunnlag,
      loeysingId,
      status,
      idx,
      elementResultat
    )
  );
}

export function createResultatManuellKontroll(
  testgrunnlag: Testgrunnlag,
  loeysingId: number,
  status: ResultatStatus,
  testregelIndex: number,
  elementResultat?: ElementResultat
): ResultatManuellKontroll {
  function createStegNummer(): string {
    return (
      faker.number.int({ min: 1, max: 9 }).toString() +
      '.' +
      faker.number.int({ min: 1, max: 9 }).toString()
    );
  }

  function createSvar(): string {
    return faker.helpers.arrayElement(['Ja', 'Nei']);
  }

  const sideutvalIdForLoeysingId = testgrunnlag.sideutval.find(
    (su) => su.loeysingId === loeysingId
  )!.id;

  switch (status) {
    case 'IkkjePaabegynt':
      return {
        id: faker.number.int(),
        svar: [],
        status: 'IkkjePaabegynt',
        testgrunnlagId: testgrunnlag.id,
        loeysingId: loeysingId,
        testregelId: testgrunnlag.testreglar[testregelIndex].id,
        sideutvalId: sideutvalIdForLoeysingId,
        sistLagra: faker.date.recent().toISOString(),
      };
    case 'UnderArbeid':
      return {
        id: faker.number.int(),
        svar: [1, 2, 3].map(() => ({
          steg: createStegNummer(),
          svar: createSvar(),
        })),
        status: 'UnderArbeid',
        testgrunnlagId: testgrunnlag.id,
        loeysingId: loeysingId,
        testregelId: testgrunnlag.testreglar[testregelIndex].id,
        sideutvalId: sideutvalIdForLoeysingId,
        sistLagra: faker.date.recent().toISOString(),
      };
    default:
      return {
        id: faker.number.int(),
        svar: [1, 2, 3, 4, 5, 6].map(() => ({
          steg: createStegNummer(),
          svar: createSvar(),
        })),
        status: 'Ferdig',
        testgrunnlagId: testgrunnlag.id,
        loeysingId: loeysingId,
        testregelId: testgrunnlag.testreglar[testregelIndex].id,
        sideutvalId: sideutvalIdForLoeysingId,
        elementOmtale: faker.lorem.word(),
        elementResultat:
          elementResultat ??
          faker.helpers.arrayElement(['samsvar', 'ikkjeForekomst', 'brot']),
        elementUtfall: faker.lorem.word(),
        testVartUtfoert: faker.date.recent().toISOString(),
        kommentar: faker.lorem.words(),
        sistLagra: faker.date.recent().toISOString(),
      };
  }
}
