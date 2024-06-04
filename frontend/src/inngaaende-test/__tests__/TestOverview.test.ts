import { describe, expect, test } from 'vitest';

import { viewTestType } from '../test-overview/TestOverview';
import { createOpprinneligTest, createRetest } from './testdata';

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
