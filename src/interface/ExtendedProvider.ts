import { Provider } from 'web3/providers';

export default interface ExtendedProvider extends Provider {
  isMetaMask: boolean;
  isTrust: boolean;
  isGoWallet: boolean;
  isAlphaWallet: boolean;
  isStatus: boolean;
  isToshi: boolean;
  host: string;
}
