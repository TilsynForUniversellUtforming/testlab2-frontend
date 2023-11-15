import { getFullPath } from '@common/util/routeUtils';
import { describe, expect, it } from 'vitest';

import { ROOT } from '../../../AppRoutes';

describe('routeUtils', () => {
  describe('getFullPath', () => {
    it('should return a path for a simple route without parent', () => {
      const route = { navn: 'Heim', path: 'heim' };
      const result = getFullPath(route);
      expect(result).toBe('/heim');
    });

    it('should return a path for a route with parent', () => {
      const parentRoute = { navn: 'Sak', path: 'sak' };
      const childRoute = { navn: 'Ny', path: 'ny', parentRoute };
      const result = getFullPath(childRoute);
      expect(result).toBe('/sak/ny');
    });

    it('should handle ID replacements in the path', () => {
      const route = { navn: 'Måling', path: 'maaling/:id' };
      const idReplacement = { id: '42', pathParam: ':id' };
      const result = getFullPath(route, idReplacement);
      expect(result).toBe('/maaling/42');
    });

    it('should handle multiple ID replacements', () => {
      const parentRoute = { navn: 'Måling', path: 'maaling/:id' };
      const childRoute = {
        navn: 'Test',
        path: 'test/:loeysingId',
        parentRoute,
      };
      const replacements = [
        { id: '123', pathParam: ':id' },
        { id: '456', pathParam: ':loeysingId' },
      ];
      const result = getFullPath(childRoute, ...replacements);
      expect(result).toBe('/maaling/123/test/456');
    });

    it('should return ".." for ROOT route', () => {
      const result = getFullPath(ROOT);
      expect(result).toBe('..');
    });
  });
});
