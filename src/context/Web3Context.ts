import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { EventEmitter } from 'events';

import { getNetworkName } from '../util/network';
declare global {
  interface Window {
    ethereum: Provider;
  }
}

export class Web3Context extends EventEmitter {
  public connected: boolean;
  public accounts: string[] | null;
  public networkId: number | null;
  public lib: Web3;

  public static NetworkIdChangedEventName = 'NetworkIdChanged';
  public static AccountsChangedEventName = 'AccountsChanged';
  public static ConnectionChangedEventName = 'ConnectionChanged';

  private interval: NodeJS.Timeout;

  public constructor(provider: Provider) {
    super();

    this.lib = new Web3(provider);

    this.startPoll();
  }

  public startPoll(): void {
    const poll = async (): Promise<void> => {
      try {
        // get the current network ID
        const newNetworkId = await this.lib.eth.net.getId();
        this.updateValueAndFireEvent(newNetworkId, 'networkId', Web3Context.NetworkIdChangedEventName, (): any[] => [
          getNetworkName(this.networkId),
        ]);
        // get the accounts
        const newAccounts = await this.lib.eth.getAccounts();
        this.updateValueAndFireEvent(newAccounts, 'accounts', Web3Context.AccountsChangedEventName);
        // if web3 provider calls are success then we are connected
        this.updateValueAndFireEvent(true, 'connected', Web3Context.ConnectionChangedEventName);
      } catch (e) {
        // provider methods fail so we have to update the state and fire the events
        this.updateValueAndFireEvent(false, 'connected', Web3Context.ConnectionChangedEventName);
        this.updateValueAndFireEvent(null, 'networkId', Web3Context.NetworkIdChangedEventName, (): any[] => [
          this.networkId,
          getNetworkName(this.networkId),
        ]);
        this.updateValueAndFireEvent(null, 'accounts', Web3Context.AccountsChangedEventName);
        // log error here
        console.log(e);
      }
      this.interval = setTimeout(poll, 1000);
    };

    // start poll to detect web3 provider state change
    this.interval = setTimeout(poll, 1000);
  }

  private updateValueAndFireEvent<T>(
    newValue: T,
    property: string,
    eventName: string,
    getArgs: Function = (): any[] => [],
  ): void {
    if (newValue !== this[property]) {
      this[property] = newValue;
      this.emit(eventName, this[property], ...getArgs());
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

export function fromConnection(connection: string): Web3Context {
  return new Web3Context(new Web3(connection).currentProvider);
}

export function fromInjected(): Web3Context {
  // Detect whether the current browser is ethereum-compatible,
  // and return null if it is not
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  const injected = window.ethereum as any;

  // disable auto refresh if possible
  if (injected.autoRefreshOnNetworkChange) {
    injected.autoRefreshOnNetworkChange = false;
  }

  return new Web3Context(window.ethereum);
}
