import { Provider } from 'web3/providers';
// TODO: Add React and React Hook linting rules
import { useState, useEffect } from 'react';
import * as providers from '../providers';

import Web3Context, { Web3ContextOptions } from '../context/Web3Context';

type Web3ContextCallback = () => Promise<Web3Context>;

export function useWeb3Context(provider: Provider, options?: Web3ContextOptions): Web3Context {
  // TODO: update the context when the options change
  const [context] = useState((): Web3Context => new Web3Context(provider, options));

  useEffect((): (() => void) => {
    context.startPoll();
    return (): void => {
      context.stopPoll();
    };
  }, [context]);

  return context;
}

export function useWeb3Injected(options?: Web3ContextOptions): Web3Context {
  const [provider] = useState((): Provider => providers.injected());
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
