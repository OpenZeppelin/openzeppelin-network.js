import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { EventEmitter } from 'events';
import timeout from '../util/timeout';
import { GSNProvider } from '@openzeppelin/gsn-provider';

import ExtendedProvider from '../interface/ExtendedProvider';
import getNetworkName from '../util/network';
import getProviderName from '../util/providerName';

declare global {
  interface Window {
    ethereum: Provider;
  }
}

export interface Web3ContextOptions {
  timeout: number;
  pollInterval: number;
  gsn: boolean | object;
}

// TODO: Change event to use types using conditional types
export default class Web3Context extends EventEmitter {
  public static NetworkIdChangedEventName = 'NetworkIdChanged';
  public static AccountsChangedEventName = 'AccountsChanged';
  public static ConnectionChangedEventName = 'ConnectionChanged';

  public readonly lib: Web3;
  public readonly timeout: number;
  public readonly pollInterval: number;
  public readonly providerName: string;

  public connected: boolean = false;
  public accounts: string[] | null = [];
  public networkId: number | null = null;
  public networkName: string | null = null;

  private pollHandle?: ReturnType<typeof setTimeout>;

  public constructor(provider: Provider, options?: Partial<Web3ContextOptions>) {
    super();

    const fullOptions: Web3ContextOptions = Object.assign(
      {},
      { timeout: 3000, pollInterval: 500, gsn: false },
      options,
    );

    if (!provider) throw new Error('A web3 provider has to be defined');

    if (fullOptions.gsn) {
      const gsnOptions = typeof fullOptions.gsn === 'object' ? fullOptions.gsn : { useGSN: true };
      provider = new GSNProvider(provider, gsnOptions);
    }

    this.providerName = getProviderName(provider as ExtendedProvider);
    this.lib = new Web3(provider);
    this.timeout = fullOptions.timeout;
    this.pollInterval = fullOptions.pollInterval;
  }

  public startPoll(): void {
    // TODO: polling interval should depend on kind of web3 provider
    // We can query local providers often but doing the same for the network providers may create a lot of overhead
    this.pollHandle = setTimeout(this.poll.bind(this), this.pollInterval);
  }

  public stopPoll(): void {
    if (this.pollHandle) clearTimeout(this.pollHandle);
  }

  public async poll(): Promise<void> {
    // TODO: Fiture out elegant way retrive property name dynamically
    const networkIdName = 'networkId';
    const accountsName = 'accounts';
    const connectedName = 'connected';
    // getting deep here
    const networkNameName = 'networkName';
    try {
      // get the current network ID
      const newNetworkId = await timeout(this.lib.eth.net.getId(), this.timeout);

      const newNetworkName = getNetworkName(newNetworkId);
      this.updateValueAndFireEvent(
        newNetworkId,
        networkIdName,
        Web3Context.NetworkIdChangedEventName,
        (): unknown[] => [newNetworkName],
      );
      this.updateValueAndFireEvent(newNetworkName, networkNameName);
      // get the accounts
      const newAccounts = await timeout(this.lib.eth.getAccounts(), this.timeout);
      this.updateValueAndFireEvent(newAccounts, accountsName, Web3Context.AccountsChangedEventName);
      // if web3 provider calls are success then we are connected
      this.updateValueAndFireEvent(true, connectedName, Web3Context.ConnectionChangedEventName);
    } catch (e) {
      // provider methods fail so we have to update the state and fire the events
      this.updateValueAndFireEvent(false, connectedName, Web3Context.ConnectionChangedEventName);
      this.updateValueAndFireEvent(null, networkIdName, Web3Context.NetworkIdChangedEventName, (): unknown[] => [null]);
      this.updateValueAndFireEvent(null, networkNameName);
      this.updateValueAndFireEvent(null, accountsName, Web3Context.AccountsChangedEventName);
      // TODO: Implement throtling so we do not spam console
      // console.log(e);
    } finally {
      this.startPoll();
    }
  }

  private updateValueAndFireEvent<P extends keyof this>(
    newValue: this[P],
    property: P,
    eventName?: string,
    getArgs: Function = (): unknown[] => [],
  ): void {
    if (newValue !== this[property]) {
      this[property] = newValue;
      if (eventName) this.emit(eventName, this[property], ...getArgs());
    }
  }

  // request access according to the EIP
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md
  public async requestAuth(): Promise<string[]> {
    // Request authentication
    if (this.lib.currentProvider.send !== undefined) {
      return new Promise((resolve, reject): void => {
        const responseHandler = (error: unknown, response: { error: string; result: string[] }): void => {
          if (error || response.error) {
            reject(error || response.error);
          } else {
            resolve(response.result);
          }
        };
        const send = this.lib.currentProvider.send as Function;
        send({ method: 'eth_requestAccounts' }, responseHandler);
      });
    } else return Promise.reject(new Error("Web3 provider doesn't support send method"));
  }
}
