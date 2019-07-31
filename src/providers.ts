import Web3 from 'web3';
import { Provider } from 'web3/providers';
import ExtendedProvider from './interface/ExtendedProvider';

declare global {
  interface Window {
    ethereum: Provider;
  }
}

export function connection(conn: string): Provider {
  return new Web3(conn).currentProvider;
}

export function injected(): Provider {
  // Detect whether the current browser is ethereum-compatible,
  // and throw an error if it is not
  if (window.ethereum === undefined) {
    throw new Error('Web3 provider is not attached to the window.');
  }

  const provider = window.ethereum as ExtendedProvider;

  // disable auto refresh if possible
  if (provider.autoRefreshOnNetworkChange === true) {
    provider.autoRefreshOnNetworkChange = false;
  }

  return provider;
}
