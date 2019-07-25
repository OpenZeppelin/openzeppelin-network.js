import Web3Context, { Web3ContextOptions } from './Web3Context';
export declare function fromConnection(connection: string, options?: Web3ContextOptions): Promise<Web3Context>;
export declare function fromInjected(options?: Web3ContextOptions): Promise<Web3Context>;
