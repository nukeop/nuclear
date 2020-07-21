import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createStateSelectors } from '../../app/selectors/helpers';

describe('selectors/helpers', () => {
  describe('createStateSelectors', () => {
    it('creates a map of selectors', () => {
      const selectors = createStateSelectors(
        'test',
        ['test1', 'test2', 'test3']
      );
      const state = {
        test: {
          test1: 'abc',
          test2: 'def',
          test3: 'ghi'
        }
      };
      expect(selectors.test1(state)).to.equal('abc');
      expect(selectors.test2(state)).to.equal('def');
      expect(selectors.test3(state)).to.equal('ghi');
    });

    it('works with incomplete state', () => {
      const selectors = createStateSelectors(
        'test',
        ['test1', 'test2', 'test3']
      );
      const state = {
        test: {
          test2: 'def'
        }
      };
      expect(selectors.test1(state)).to.equal(undefined);
      expect(selectors.test2(state)).to.equal('def');
      expect(selectors.test3(state)).to.equal(undefined);
    });

    it('works with incomplete subtree', () => {
      const selectors = createStateSelectors(
        'test',
        ['test1', 'test2', 'test3']
      );
      const state = {};
      expect(selectors.test1(state)).to.equal(undefined);
      expect(selectors.test2(state)).to.equal(undefined);
      expect(selectors.test3(state)).to.equal(undefined);
    });
  });
});
