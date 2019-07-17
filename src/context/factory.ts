import Web3 from 'web3';
import Web3Context from './Web3Context';

export async function fromConnection(connection: string): Promise<Web3Context> {
  const context = new Web3Context(new Web3(connection).currentProvider);
  context.startPoll();
  await context.poll();

  return context;
}

export async function fromInjected(): Promise<Web3Context> {
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

  const context = new Web3Context(window.ethereum);
  context.startPoll();
  await context.poll();

  return context;
}
