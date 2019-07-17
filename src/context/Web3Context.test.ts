import Web3 from 'web3';

import Web3Context from './Web3Context';
import sleep from '../util/sleep';

const localConnection = 'http://localhost:7545';
const accounts = ['0x48d21Dc6BBF18288520E9384aA505015c26ea43C'];
let context;

beforeEach((): void => {
  jest.resetAllMocks();
  jest.useFakeTimers();
  context = new Web3Context(new Web3(localConnection).currentProvider, { timeout: 100 });
});

describe('Web3Context', (): void => {
  describe('Web3Context constructor', (): void => {
    it('creates Web3Context', (): void => {
      expect(context).not.toBeNull();
      expect(context.lib).not.toBeNull();
    });
  });

  describe('startPoll method', (): void => {
    it('starts poll', (): void => {
      context.startPoll();

      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
      expect(context.interval).toBeTruthy();
    });
  });

  describe('stopPoll method', (): void => {
    it('stops poll', (): void => {
      context.interval = 14322;

      context.stopPoll();

      expect(clearTimeout).toHaveBeenCalled();
      expect(clearTimeout).toHaveBeenLastCalledWith(context.interval);
    });
  });

  describe('poll method', (): void => {
    describe('when web3 provider is alive', (): void => {
      it('polls fresh data', async (): Promise<void> => {
        context.lib.eth.net.getId = jest.fn((): Promise<number> => Promise.resolve(1));
        context.lib.eth.getAccounts = jest.fn((): Promise<string[]> => Promise.resolve(accounts));
        context.emit = jest.fn();

        await context.poll();

        expect(context.lib.eth.net.getId).toHaveBeenCalled();
        expect(context.networkId).toBe(1);
        expect(context.networkName).toBe('Main');

        expect(context.lib.eth.getAccounts).toHaveBeenCalled();
        expect(context.accounts).toBe(accounts);

        expect(context.connected).toBe(true);

        expect(context.emit).toHaveBeenCalledTimes(3);

        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
        expect(context.interval).toBeTruthy();
      });
    });
    describe('when web3 provider is dead', (): void => {
      it('updates state', async (): Promise<void> => {
        context.lib.eth.net.getId = jest.fn((): Promise<number> => Promise.reject('nope'));
        context.lib.eth.getAccounts = jest.fn((): Promise<string[]> => Promise.reject('nope'));
        context.emit = jest.fn();

        await context.poll();

        expect(context.lib.eth.net.getId).toHaveBeenCalled();
        expect(context.lib.eth.getAccounts).not.toHaveBeenCalled();

        expect(context.networkId).toBe(null);
        expect(context.networkName).toBe(null);

        expect(context.accounts).toBe(null);

        expect(context.connected).toBe(false);

        expect(context.emit).toHaveBeenCalledTimes(3);

        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
        expect(context.interval).toBeTruthy();
      });
    });
    describe('when web3 provider timeouts', (): void => {
      it('updates state', async (): Promise<void> => {
        context.lib.eth.net.getId = jest.fn(
          async (): Promise<number> => {
            await sleep(100 * 1000);
            return Promise.resolve(1);
          },
        );
        context.lib.eth.getAccounts = jest.fn((): Promise<string[]> => Promise.resolve(accounts));
        context.emit = jest.fn();

        const pollPromise = context.poll();
        jest.runOnlyPendingTimers();
        await pollPromise;

        expect(context.lib.eth.net.getId).toHaveBeenCalled();
        expect(context.lib.eth.getAccounts).not.toHaveBeenCalled();
        expect(context.networkId).toBe(null);
        expect(context.networkName).toBe(null);

        expect(context.accounts).toBe(null);

        expect(context.connected).toBe(false);

        expect(context.emit).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('getProviderName method', (): void => {
    it('gets name of the provider', (): void => {
      const provider = context.lib.currentProvider as ({ isMetaMask: boolean });
      provider.isMetaMask = true;

      const providerName = context.getProviderName();

      expect(providerName).toBe('metamask');
    });
  });

  describe('requestAuth method', (): void => {
    describe('requests auth with proper provider', (): void => {
      it('success if user approve', async (): Promise<void> => {
        context.lib.currentProvider.send = jest.fn((req, res): void => {
          res(null, { result: accounts });
        });

        const retVal = await context.requestAuth();

        expect(retVal).toBe(accounts);
      });

      it('throws if user reject', async (): Promise<void> => {
        context.lib.currentProvider.send = jest.fn((req, res): void => {
          res({ error: 'nope' }, {});
        });

        await expect(context.requestAuth()).rejects.toMatchObject({
          error: 'nope',
        });
      });
    });
    it('fails with wrong provider', async (): Promise<void> => {
      delete context.lib.currentProvider.constructor.prototype.send;

      await expect(context.requestAuth()).rejects.toMatchObject({
        message: "Web3 provider doesn't support send method",
      });
    });
  });
});
