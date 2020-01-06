import Web3 from 'web3';
import { Provider } from 'web3/providers';
import ExtendedProvider from '../interface/ExtendedProvider';

declare global {
  interface Window {
    ethereum: Provider;
  }
}

export function connection(conn: string): Provider {
  return new Web3(conn).currentProvider;
}

export function tryInjected(): Provider | undefined {
  // Detect whether the current browser is ethereum-compatible
  if (window.ethereum === undefined) return undefined;
  const provider = window.ethereum as ExtendedProvider;

  // Disable auto refresh if possible
  if (provider.autoRefreshOnNetworkChange === true) {
    provider.autoRefreshOnNetworkChange = false;
  }

  return provider;
}

export function injected(): Provider {
  const provider = tryInjected();
  if (!provider) throw new Error('A web3 provider is not attached to a window.');
  return provider;
}
