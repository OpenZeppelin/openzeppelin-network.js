import Web3 from 'web3';

import Web3Context from './Web3Context';

const localConnection = 'http://localhost:7545';
const accounts = ['0x48d21Dc6BBF18288520E9384aA505015c26ea43C'];
let context;

beforeEach((): void => {
  jest.useFakeTimers();
  context = new Web3Context(new Web3(localConnection).currentProvider);
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

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

      expect(context.interval).toBeTruthy();
    });
  });

  describe('stopPoll method', (): void => {
    it('stops poll', (): void => {
      context.interval = 14322;

      context.stopPoll();

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenLastCalledWith(context.interval);
    });
  });

  describe('getProviderName method', (): void => {
    it('gets name of the provider', (): void => {
      const provider = context.lib.currentProvider as any;
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
