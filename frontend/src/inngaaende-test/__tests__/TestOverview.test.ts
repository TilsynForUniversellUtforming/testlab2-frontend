import { ResultatManuellKontroll } from '@test/api/types';
import { describe, expect, test } from 'vitest';

import { viewTestType, visRetestKnapp } from '../test-overview/TestOverview';
import {
  createOpprinneligTest,
  createResultatManuellKontroll,
  createRetest,
} from './testdata';

describe('visRetestKnapp', () => {
  const testgrunnlag = createOpprinneligTest(); // Replace with a valid Testgrunnlag object
  const alleTestgrunnlag = [testgrunnlag]; // Replace with an array of Testgrunnlag objects

  test('should return true when status is "ferdig"', () => {
    const resultater = [
      createResultatManuellKontroll(
        testgrunnlag,
        testgrunnlag.sideutval[0].loeysingId,
        'Ferdig',
        'brot'
      ),
    ];

    const result = visRetestKnapp(
      testgrunnlag,
      testgrunnlag.sideutval[0].loeysingId,
      alleTestgrunnlag,
      resultater
    );

    expect(result).toBe(true);
  });

  test('should return false when there are no results', () => {
    const resultater: ResultatManuellKontroll[] = [];

    const result = visRetestKnapp(
      testgrunnlag,
      testgrunnlag.sideutval[0].loeysingId,
      alleTestgrunnlag,
      resultater
    );

    expect(result).toBe(false);
  });

  test('should return false when there are some results, but none are finished', () => {
    const resultater = [
      createResultatManuellKontroll(
        testgrunnlag,
        testgrunnlag.sideutval[0].loeysingId,
        'UnderArbeid'
      ),
    ];

    const result = visRetestKnapp(
      testgrunnlag,
      testgrunnlag.sideutval[0].loeysingId,
      alleTestgrunnlag,
      resultater
    );

    expect(result).toBe(false);
  });

  test('retest skal vises hvis testgrunnlaget er det siste av alle testgrunnlagene', () => {
    const testgrunnlag = createOpprinneligTest();
    const retest1 = createRetest(testgrunnlag);
    const retest2 = createRetest(retest1);
    const alleTestgrunnlag = [testgrunnlag, retest1, retest2];

    expect(
      visRetestKnapp(
        testgrunnlag,
        testgrunnlag.sideutval[0].loeysingId,
        alleTestgrunnlag,
        [
          createResultatManuellKontroll(
            testgrunnlag,
            testgrunnlag.sideutval[0].loeysingId,
            'Ferdig'
          ),
        ]
      )
    ).toBe(false);
    expect(
      visRetestKnapp(
        retest1,
        retest1.sideutval[0].loeysingId,
        alleTestgrunnlag,
        [
          createResultatManuellKontroll(
            retest1,
            retest1.sideutval[0].loeysingId,
            'Ferdig'
          ),
        ]
      )
    ).toBe(false);
    expect(
      visRetestKnapp(
        retest2,
        retest2.sideutval[0].loeysingId,
        alleTestgrunnlag,
        [
          createResultatManuellKontroll(
            retest2,
            retest2.sideutval[0].loeysingId,
            'Ferdig',
            'brot'
          ),
        ]
      )
    ).toBe(true);
  });

  test('retest skal ikke vises hvis det ikke er noen brudd', () => {
    const opprinneligTest = createOpprinneligTest();
    const retest1 = createRetest(opprinneligTest);
    const alleTestgrunnlag = [opprinneligTest, retest1];
    const resultater = [
      createResultatManuellKontroll(
        opprinneligTest,
        testgrunnlag.sideutval[0].loeysingId,
        'Ferdig',
        'brot'
      ),
      createResultatManuellKontroll(
        retest1,
        testgrunnlag.sideutval[0].loeysingId,
        'Ferdig',
        'samsvar'
      ),
      createResultatManuellKontroll(
        retest1,
        testgrunnlag.sideutval[0].loeysingId,
        'Ferdig',
        'ikkjeForekomst'
      ),
    ];

    expect(
      visRetestKnapp(
        retest1,
        retest1.sideutval[0].loeysingId,
        alleTestgrunnlag,
        resultater
      )
    ).toBe(false);
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
