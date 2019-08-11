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
  it('create a provider from a connection', async (): Promise<void> => {
    const provider = providers.connection(localConnection);

    expect(provider).not.toBeNull();
    expect((provider as ExtendedProvider).host).toEqual(localConnection);
  });
});
