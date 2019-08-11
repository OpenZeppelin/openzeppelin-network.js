import { Provider } from 'web3/providers';
import { mocked } from 'ts-jest/utils';

import { fromConnection, fromInjected } from './factory';
import Web3Context from './Web3Context';

jest.mock('./Web3Context');

const localConnection = 'http://localhost:7545';
const mockedWeb3Context = mocked(Web3Context);

describe('fromConnection function', (): void => {
  it('creates a Web3 context from a connection', async (): Promise<void> => {
    const context = await fromConnection(localConnection);

    expect(context).not.toBeNull();
    expect(mockedWeb3Context).toHaveBeenCalled();
    const web3ContextInstance = mocked(Web3Context).mock.instances[0];
    expect(web3ContextInstance.poll).toHaveBeenCalled();
    expect(web3ContextInstance.startPoll).toHaveBeenCalled();
  });
});

describe('fromInjected function', (): void => {
  it('creates Web3 a context from an injected provider', async (): Promise<void> => {
    const provider = {};
    window.ethereum = provider as Provider;

    const context = await fromInjected();

    expect(context).not.toBeNull();
    expect(mockedWeb3Context).toHaveBeenCalledWith(window.ethereum, undefined);
    const web3ContextInstance = mocked(Web3Context).mock.instances[0];
    expect(web3ContextInstance.poll).toHaveBeenCalled();
    expect(web3ContextInstance.startPoll).toHaveBeenCalled();

    delete window.ethereum;
  });

  it('fails if there is no an injected provider', async (): Promise<void> => {
    await expect(fromInjected()).rejects.toMatchObject({
      message: 'A web3 provider is not attached to a window.',
    });
  });
});
