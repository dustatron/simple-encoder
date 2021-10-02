import { ProRes } from '..';
import { getPresetNumber } from '../fileHelpers';

describe('getProres', () => {
  it('should return a number', () => {
    expect(getPresetNumber(ProRes.PROXY)).toEqual(0);
  });
});
