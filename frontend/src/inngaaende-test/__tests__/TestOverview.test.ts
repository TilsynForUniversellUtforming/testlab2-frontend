import { describe, expect, test } from 'vitest';

import { viewTestType, visRetestKnapp } from '../test-overview/TestOverview';
import { createOpprinneligTest, createRetest } from './testdata';

describe('visRetestKnapp', () => {
  const testgrunnlag = createOpprinneligTest(); // Replace with a valid Testgrunnlag object
  const alleTestgrunnlag = [testgrunnlag]; // Replace with an array of Testgrunnlag objects

  test('should return true when status is "ferdig"', () => {
    const status = 'ferdig';

    const result = visRetestKnapp(testgrunnlag, status, alleTestgrunnlag);

    expect(result).toBe(true);
  });

  test('should return false when status is "ikkje-starta"', () => {
    const status = 'ikkje-starta';

    const result = visRetestKnapp(testgrunnlag, status, alleTestgrunnlag);

    expect(result).toBe(false);
  });

  test('should return false when status is "deaktivert"', () => {
    const status = 'deaktivert';

    const result = visRetestKnapp(testgrunnlag, status, alleTestgrunnlag);

    expect(result).toBe(false);
  });

  test('should return false when status is "under-arbeid"', () => {
    const status = 'under-arbeid';

    const result = visRetestKnapp(testgrunnlag, status, alleTestgrunnlag);

    expect(result).toBe(false);
  });

  test('retest skal vises hvis testgrunnlaget er det siste av alle testgrunnlagene', () => {
    const testgrunnlag = createOpprinneligTest();
    const retest1 = createRetest(testgrunnlag);
    const retest2 = createRetest(retest1);
    const alleTestgrunnlag = [testgrunnlag, retest1, retest2];

    expect(visRetestKnapp(testgrunnlag, 'ferdig', alleTestgrunnlag)).toBe(
      false
    );
    expect(visRetestKnapp(retest1, 'ferdig', alleTestgrunnlag)).toBe(false);
    expect(visRetestKnapp(retest2, 'ferdig', alleTestgrunnlag)).toBe(true);
  });
});

describe('viewTestType', () => {
  test('retester skal navngis med løpenummer', () => {
    const opprinneligTest = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest);
    const retest2 = createRetest(retest1);
    const alleTestgrunnlag = [opprinneligTest, retest1, retest2];
    expect(
      viewTestType(retest1, [retest1.sideutval[0].id], alleTestgrunnlag)
    ).toBe('Retest 1');
    expect(
      viewTestType(retest2, [retest2.sideutval[0].id], alleTestgrunnlag)
    ).toBe('Retest 2');
  });

  test('retester som hører til forskjellige kontroller skal ha egne nummer', () => {
    const opprinneligTest1 = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest1);
    const opprinneligTest2 = createOpprinneligTest();
    const retest2 = createRetest(opprinneligTest2);

    expect(
      viewTestType(
        retest1,
        [retest1.sideutval[0].id],
        [opprinneligTest1, retest1]
      )
    ).toBe('Retest 1');
    expect(
      viewTestType(
        retest2,
        [retest2.sideutval[0].id],
        [opprinneligTest2, retest2]
      )
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

    expect(
      viewTestType(retest1, [retest1.sideutval[0].id], alleTestgrunnlag)
    ).toBe('Retest 1');
    expect(
      viewTestType(retest2, [retest2.sideutval[0].id], alleTestgrunnlag)
    ).toBe('Retest 1');
  });
});
