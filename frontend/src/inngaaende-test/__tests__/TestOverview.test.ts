import { faker } from '@faker-js/faker';
import { viewTestType } from '@test/test-overview/TestOverview';
import { Testgrunnlag } from '@test/types';
import { Testregel } from '@testreglar/api/types';
import { describe, expect, test } from 'vitest';

import { Sideutval } from '../../kontroll/sideutval/types';
import { Krav } from '../../krav/types';

describe('viewTestType', () => {
  test('retester skal navngis med løpenummer', () => {
    const opprinneligTest = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest);
    const retest2 = createRetest(retest1);
    const alleTestgrunnlag = [opprinneligTest, retest1, retest2];
    expect(viewTestType(retest1, retest1.sideutval[0], alleTestgrunnlag)).toBe(
      'Retest 1'
    );
    expect(viewTestType(retest2, retest2.sideutval[0], alleTestgrunnlag)).toBe(
      'Retest 2'
    );
  });

  test('retester som hører til forskjellige kontroller skal ha egne nummer', () => {
    const opprinneligTest1 = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest1);
    const opprinneligTest2 = createOpprinneligTest();
    const retest2 = createRetest(opprinneligTest2);

    expect(
      viewTestType(retest1, retest1.sideutval[0], [opprinneligTest1, retest1])
    ).toBe('Retest 1');
    expect(
      viewTestType(retest2, retest2.sideutval[0], [opprinneligTest2, retest2])
    ).toBe('Retest 1');
  });

  test('retester som hører til samme kontroll, men forskjellige løsninger, skal ha egne nummer', () => {
    const opprinneligTest = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest);
    const retest2 = createRetest({
      ...opprinneligTest,
      sideutval: opprinneligTest.sideutval.filter(
        (s) => s.id !== retest1.sideutval[0].id
      ),
    });
    const alleTestgrunnlag = [opprinneligTest, retest1, retest2];

    expect(viewTestType(retest1, retest1.sideutval[0], alleTestgrunnlag)).toBe(
      'Retest 1'
    );
    expect(viewTestType(retest2, retest2.sideutval[0], alleTestgrunnlag)).toBe(
      'Retest 1'
    );
  });
});

function createOpprinneligTest(): Testgrunnlag {
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

function createRetest(opprinneligTest: Testgrunnlag): Testgrunnlag {
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

function createKrav(): Krav {
  return {
    id: faker.number.int(),
    tittel: faker.lorem.words(5),
    status: 'krav status',
    innhald: faker.lorem.paragraph(),
    gjeldAutomat: faker.datatype.boolean(),
    gjeldNettsider: faker.datatype.boolean(),
    gjeldApp: faker.datatype.boolean(),
    urlRettleiing: faker.internet.url(),
    prinsipp: faker.lorem.word(),
    retningslinje: faker.lorem.word(),
    suksesskriterium: faker.lorem.word(),
    samsvarsnivaa: faker.helpers.arrayElement(['A', 'AA', 'AAA']),
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
