import { Provider } from 'web3/providers';
// TODO: Add React and React Hook linting rules
import { useState, useEffect, useReducer, Dispatch } from 'react';
import * as providers from '../providers';

import Web3Context, { Web3ContextOptions } from '../context/Web3Context';
import { fromInjected, fromConnection } from '../context/factory';

type Web3ContextCallback = () => Promise<Web3Context>;

function useForceUpdate(): Dispatch<unknown> {
  const [, forceUpdate] = useReducer((x, _: unknown) => x + 1, 0);
  return forceUpdate;
}

export function useWeb3Context(provider: Provider, options?: Web3ContextOptions): Web3Context {
  // TODO: update the context when the options change
  const [context, setContext] = useState(() => new Web3Context(provider, options));
  const forceUpdate = useForceUpdate();

  // Causes components down the tree to re-render when any of the Web3Context properties change.
  useEffect((): (() => void) => {
    context.on('NetworkIdChanged', forceUpdate);
    context.on('AccountsChanged', forceUpdate);
    context.on('ConnectionChanged', forceUpdate);
    return (): void => {
      context.off('NetworkIdChanged', forceUpdate);
      context.off('AccountsChanged', forceUpdate);
      context.off('ConnectionChanged', forceUpdate);
    };
  }, [context]);

  useEffect((): (() => void) => {
    context.startPoll();
    return (): void => {
      context.stopPoll();
    };
  }, [context]);

  return context;
}

export function useWeb3Injected(options?: Web3ContextOptions): Web3Context {
  const [provider] = useState(() => providers.injected());
  return useWeb3Context(provider, options);
}

export function useWeb3Network(connection: string, options?: Web3ContextOptions): Web3Context {
  const [provider] = useState(() => providers.connection(connection));
  return useWeb3Context(provider, options);
}

export function useWeb3(fallbackConnection: string, options?: Web3ContextOptions): Web3Context {
  const [provider] = useState(() => {
    try {
      return providers.injected();
    } catch (e) {
      return providers.connection(fallbackConnection);
    }
  });
  return useWeb3Context(provider, options);
}
