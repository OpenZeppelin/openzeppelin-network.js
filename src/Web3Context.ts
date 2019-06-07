import Web3 from 'web3';
import { Provider } from 'web3/providers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export default class Web3Context {
  public constructor(provider: Provider | string) {
    this.lib = new Web3(provider);
  }

  public connected: boolean;
  public accounts: string[] | null;
  public networkId: number | null;
  public lib: Web3;

  public onAccountsChanged(callback: (accounts: string[] | null) => void) {}

  public onNetworkChanged(callback: (networkId: number | null) => void) {}

  public onConnectionChanged(callback: (connected: boolean) => void) {}
}

export async function getInjectedWeb3(): Promise<Web3Context> {
  // Detect whether the current browser is ethereum-compatible,
  // and return null if it is not
  if (typeof window.ethereum === 'undefined') {
    return null;
  }
  // Request authentication
  await window.ethereum.enable();

  return new Web3Context(window.ethereum);
}
