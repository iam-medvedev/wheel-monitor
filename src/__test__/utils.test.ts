import { expect, it } from 'vitest';
import { px } from '../utils';

it('creates px-value', () => {
  expect(px(800)).toEqual('800px');
});
