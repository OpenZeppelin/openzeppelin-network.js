import { Provider } from 'web3/providers';
// TODO: Add React and React Hook linting rules
import { useState, useEffect } from 'react';
import * as providers from '../providers';

import Web3Context, { Web3ContextOptions } from '../context/Web3Context';
import { fromInjected, fromConnection } from '../context/factory';

type Web3ContextCallback = () => Promise<Web3Context>;

export function useWeb3Context(provider: Provider, options?: Web3ContextOptions): Web3Context {
  // TODO: update the context when the options change
  const [context, setContext] = useState(() => new Web3Context(provider, options));

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
