import * as providers from './providers';
import ExtendedProvider from '../interface/ExtendedProvider';

const localConnection = 'http://localhost:7545';

describe('providers', (): void => {
  it('create an injected provider from a window', async (): Promise<void> => {
    const provider = {};
    window.ethereum = provider as ExtendedProvider;

    const injected = providers.injected();

    expect(injected).toEqual(window.ethereum);

    delete window.ethereum;
  });

  it('returns undefined if no injected provider', async (): Promise<void> => {
    const injected = providers.tryInjected();
    expect(injected).toBeUndefined();
  });

  it('throws if no injected provider', async (): Promise<void> => {
    expect(() => providers.injected()).toThrow('A web3 provider is not attached to a window.');
  });

  it('create a provider from a connection', async (): Promise<void> => {
    const provider = providers.connection(localConnection);

    expect(provider).not.toBeNull();
    expect((provider as ExtendedProvider).host).toEqual(localConnection);
  });
});
