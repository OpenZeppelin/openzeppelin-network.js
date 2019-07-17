import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { EventEmitter } from 'events';

import { getNetworkName } from '../util/network';
declare global {
  interface Window {
    ethereum: Provider;
  }
}

export default class Web3Context extends EventEmitter {
  public connected: boolean;
  public accounts: string[] | null;
  public networkId: number | null;
  public networkName: string | null;
  public readonly lib: Web3;

  public static NetworkIdChangedEventName = 'NetworkIdChanged';
  public static AccountsChangedEventName = 'AccountsChanged';
  public static ConnectionChangedEventName = 'ConnectionChanged';

  private interval: NodeJS.Timeout;

  public constructor(provider: Provider) {
    super();

    this.lib = new Web3(provider);
  }

  public startPoll(): void {
    this.interval = setTimeout(this.poll.bind(this), 100);
  }

  public stopPoll(): void {
    clearTimeout(this.interval);
  }

  public async poll(): Promise<void> {
    const networkIdName = 'networkId';
    const accountsName = 'accounts';
    const connectedName = 'connected';
    // getting deep here
    const networkNameName = 'networkName';
    try {
      // get the current network ID
      const newNetworkId = await this.lib.eth.net.getId();
      const newNetworkName = getNetworkName(newNetworkId);
      this.updateValueAndFireEvent(newNetworkId, networkIdName, Web3Context.NetworkIdChangedEventName, (): any[] => [
        newNetworkName,
      ]);
      this.updateValueAndFireEvent(newNetworkName, networkNameName);
      // get the accounts
      const newAccounts = await this.lib.eth.getAccounts();
      this.updateValueAndFireEvent(newAccounts, accountsName, Web3Context.AccountsChangedEventName);
      // if web3 provider calls are success then we are connected
      this.updateValueAndFireEvent(true, connectedName, Web3Context.ConnectionChangedEventName);
    } catch (e) {
      // provider methods fail so we have to update the state and fire the events
      this.updateValueAndFireEvent(false, connectedName, Web3Context.ConnectionChangedEventName);
      this.updateValueAndFireEvent(null, networkIdName, Web3Context.NetworkIdChangedEventName, (): any[] => [null]);
      this.updateValueAndFireEvent(null, networkNameName);
      this.updateValueAndFireEvent(null, accountsName, Web3Context.AccountsChangedEventName);
      // log error here
      console.log(e);
    } finally {
      this.interval = setTimeout(this.poll.bind(this), 100);
    }
  }

  private updateValueAndFireEvent<T>(
    newValue: T,
    property: string,
    eventName: string = null,
    getArgs: Function = (): any[] => [],
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
        const responseHandler = (error, response): void => {
          if (error || response.error) {
            reject(error || response.error);
          } else {
            resolve(response.result);
          }
        };
        this.lib.currentProvider.send({ method: 'eth_requestAccounts' } as any, responseHandler as any);
      });
    } else return Promise.reject(new Error("Web3 provider doesn't support send method"));
  }

  public getProviderName(): string {
    if (!this.lib) return 'unknown';

    const provider = this.lib.currentProvider as any;

    if (provider.isMetaMask) return 'metamask';

    if (provider.isTrust) return 'trust';

    if (provider.isGoWallet) return 'goWallet';

    if (provider.isAlphaWallet) return 'alphaWallet';

    if (provider.isStatus) return 'status';

    if (provider.isToshi) return 'coinbase';

    if (provider.constructor.name === 'EthereumProvider') return 'mist';

    if (provider.constructor.name === 'Web3FrameProvider') return 'parity';

    if (provider.host && provider.host.indexOf('infura') !== -1) return 'infura';

    return 'unknown';
  }
}
