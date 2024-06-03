import { faker } from '@faker-js/faker';

import { Krav } from '../types';

export function createKrav(): Krav {
  return {
    id: faker.number.int(),
    tittel: faker.lorem.words(5),
    status: faker.string.alpha({ length: 5 }),
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
