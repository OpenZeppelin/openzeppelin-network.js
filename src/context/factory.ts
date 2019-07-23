import Web3 from 'web3';
import Web3Context, { Web3ContextOptions } from './Web3Context';
import ExtendedProvider from '../interface/ExtendedProvider';

export async function fromConnection(connection: string, options?: Web3ContextOptions): Promise<Web3Context> {
  const context = new Web3Context(new Web3(connection).currentProvider, options);
  context.startPoll();
  await context.poll();

  return context;
}

export async function fromInjected(options?: Web3ContextOptions): Promise<Web3Context> {
  // Detect whether the current browser is ethereum-compatible,
  // and return null if it is not
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  const injected = window.ethereum as ExtendedProvider;

  // disable auto refresh if possible
  if (injected.autoRefreshOnNetworkChange) {
    injected.autoRefreshOnNetworkChange = false;
  }

  const context = new Web3Context(window.ethereum, options);
  context.startPoll();
  await context.poll();

  return context;
}
