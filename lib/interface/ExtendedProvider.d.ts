import { Provider } from 'web3/providers';
export default interface ExtendedProvider extends Provider {
    autoRefreshOnNetworkChange?: boolean;
    isMetaMask?: boolean;
    isTrust?: boolean;
    isGoWallet?: boolean;
    isAlphaWallet?: boolean;
    isStatus?: boolean;
    isToshi?: boolean;
    host?: string;
    connection?: WebSocket;
}
