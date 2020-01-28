import { Provider } from 'web3/providers';
// TODO: Add React and React Hook linting rules
import { useState, useEffect } from 'react';
import * as providers from '../context/providers';

import Web3Context, { Web3ContextOptions } from '../context/Web3Context';
import useForceUpdate from '../util/forceUpdate';

export function useWeb3Context(provider: Provider, options?: Web3ContextOptions): Web3Context {
  // TODO: update the context when the options change
  const [context] = useState((): Web3Context => new Web3Context(provider, options));

  const forceUpdate = useForceUpdate();

  function callForceUpdate(): void {
    forceUpdate(42);
  }

  // Causes components down the tree to re-render when any of the Web3Context properties change.
  useEffect((): (() => void) => {
    context.on(Web3Context.NetworkIdChangedEventName, callForceUpdate);
    context.on(Web3Context.AccountsChangedEventName, callForceUpdate);
    context.on(Web3Context.ConnectionChangedEventName, callForceUpdate);
    return (): void => {
      context.off(Web3Context.NetworkIdChangedEventName, callForceUpdate);
      context.off(Web3Context.AccountsChangedEventName, callForceUpdate);
      context.off(Web3Context.ConnectionChangedEventName, callForceUpdate);
    };
  }, [context]);

  useEffect((): (() => void) => {
    context.poll();
    return (): void => {
      context.stopPoll();
    };
  }, [context]);

  return context;
}

export function useWeb3Injected(options?: Web3ContextOptions): Web3Context | undefined {
  const [provider] = useState((): Provider | undefined => providers.tryInjected());
  if (!provider) return undefined;
  return useWeb3Context(provider, options);
}

export function useWeb3Network(connection: string, options?: Web3ContextOptions): Web3Context {
  const [provider] = useState((): Provider => providers.connection(connection));
  return useWeb3Context(provider, options);
}

export function useWeb3(fallbackConnection: string, options?: Web3ContextOptions): Web3Context {
  const [provider] = useState(
    (): Provider => {
      try {
        return providers.injected();
      } catch (e) {
        return providers.connection(fallbackConnection);
      }
    },
  );
  return useWeb3Context(provider, options);
}
