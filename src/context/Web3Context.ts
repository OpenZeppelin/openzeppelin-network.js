import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { EventEmitter } from 'events';

declare global {
  interface Window {
    ethereum: Provider;
  }
}

export default class Web3Context extends EventEmitter {
  public connected: boolean;
  public accounts: string[] | null;
  public networkId: number | null;
  public lib: Web3;

  private interval: NodeJS.Timeout;

  public constructor(provider: Provider | string) {
    super();

    this.lib = new Web3(provider);

    // start poll to detect web3 provider state change
    this.interval = setInterval(this.poll, 100);
  }

  private async poll(): Promise<void> {
    try {
      // get the current network ID
      const newNetworkId = await this.lib.eth.net.getId();
      // get the accounts
      const newAccounts = await this.lib.eth.getAccounts();
    } catch (e) {
      // provider methods fail so we have to update the state and fire the events
      // log error here
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

  public async startPoll(): Promise<void> {}

  public onAccountsChanged(callback: (accounts: string[] | null) => void) {}

  public onNetworkChanged(callback: (networkId: number | null) => void) {}

  public onConnectionChanged(callback: (connected: boolean) => void) {}

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
  return new Web3Context(connection);
}

export function fromInjected(): Web3Context {
  // Detect whether the current browser is ethereum-compatible,
  // and return null if it is not
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  return new Web3Context(window.ethereum);
}
