// TODO: Add React and React Hook linting rules
import { useState, useEffect, DependencyList } from 'react';

import Web3Context, { Web3ContextOptions } from '../context/Web3Context';
import { fromInjected, fromConnection } from '../context/factory';

type Web3ContextCallback = () => Promise<Web3Context>;

export function useWeb3Context(factory: Web3ContextCallback, deps?: DependencyList): Web3Context | null {
  const [context, setContext] = useState<Web3Context | null>(null);

  useEffect(
    (): (() => void) => {
      const getWeb3 = async (): Promise<void> => {
        const web3Context = await factory();
        setContext(web3Context);
      };
      getWeb3();
      return (): void => {
        if (context) {
          context.stopPoll();
        }
      };
    },
    deps ? deps : [],
  );

  return context;
}

export function useWeb3Injected(options?: Web3ContextOptions, deps?: DependencyList): Web3Context | null {
  return useWeb3Context((): Promise<Web3Context> => fromInjected(options), deps);
}

export function useWeb3Network(
  connection: string,
  options?: Web3ContextOptions,
  deps?: DependencyList,
): Web3Context | null {
  return useWeb3Context((): Promise<Web3Context> => fromConnection(connection, options), deps);
}
