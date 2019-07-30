import { DependencyList } from 'react';
import Web3Context, { Web3ContextOptions } from '../context/Web3Context';
declare type Web3ContextCallback = () => Promise<Web3Context>;
export declare function useWeb3Context(factory: Web3ContextCallback, deps?: DependencyList): Web3Context | null;
export declare function useWeb3Injected(options?: Web3ContextOptions, deps?: DependencyList): Web3Context | null;
export declare function useWeb3Network(connection: string, options?: Web3ContextOptions, deps?: DependencyList): Web3Context | null;
export {};
