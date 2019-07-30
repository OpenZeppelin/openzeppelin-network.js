/// <reference types="node" />
import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { EventEmitter } from 'events';
declare global {
    interface Window {
        ethereum: Provider;
    }
}
export interface Web3ContextOptions {
    timeout: number;
    pollInterval: number;
}
export default class Web3Context extends EventEmitter {
    static NetworkIdChangedEventName: string;
    static AccountsChangedEventName: string;
    static ConnectionChangedEventName: string;
    readonly lib: Web3;
    readonly timeout: number;
    readonly pollInterval: number;
    readonly providerName: string;
    connected: boolean;
    accounts: string[] | null;
    networkId: number | null;
    networkName: string | null;
    private pollHandle?;
    constructor(provider: Provider, options?: Web3ContextOptions);
    startPoll(): void;
    stopPoll(): void;
    poll(): Promise<void>;
    private updateValueAndFireEvent;
    requestAuth(): Promise<string[]>;
}
