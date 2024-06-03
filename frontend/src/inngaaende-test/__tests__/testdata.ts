import { faker } from '@faker-js/faker';
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

export function createRetest(opprinneligTest: Testgrunnlag): Testgrunnlag {
  return {
    ...opprinneligTest,
    namn: `retest: ${opprinneligTest.namn}`,
    type: 'RETEST',
    sideutval: [faker.helpers.arrayElement(opprinneligTest.sideutval)],
    datoOppretta: faker.date
      .between({
        from: opprinneligTest.datoOppretta,
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
