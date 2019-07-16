import { getNetworkName } from './network';

describe('getNetworkName function', (): void => {
  it('return proper network names', (): void => {
    expect(getNetworkName(1)).toBe('Main');
    expect(getNetworkName(3)).toBe('Ropsten');
    expect(getNetworkName(4)).toBe('Rinkeby');
    expect(getNetworkName(42)).toBe('Kovan');
  });
});
