import getProviderName from './providerName';
import ExtendedProvider from '../interface/ExtendedProvider';

describe('getProviderName function', (): void => {
  it('gets name of the provider', (): void => {
    const provider = { isMetaMask: true };
    const providerName = getProviderName(provider as ExtendedProvider);

    expect(providerName).toBe('metamask');
  });
});
