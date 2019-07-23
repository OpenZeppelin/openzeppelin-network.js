import ExtendedProvider from '../interface/ExtendedProvider';

export default function getProviderName(provider: ExtendedProvider): string {
  if (provider.isMetaMask) return 'metamask';

  if (provider.isTrust) return 'trust';

  if (provider.isGoWallet) return 'goWallet';

  if (provider.isAlphaWallet) return 'alphaWallet';

  if (provider.isStatus) return 'status';

  if (provider.isToshi) return 'coinbase';

  if (provider.constructor.name === 'EthereumProvider') return 'mist';

  if (provider.constructor.name === 'Web3FrameProvider') return 'parity';

  if (provider.host && provider.host.indexOf('infura') !== -1) return 'infura';

  if (provider.connection && provider.connection.url.indexOf('infura') !== -1) return 'infura';

  if (provider.host && provider.host.indexOf('localhost') !== -1) return 'localhost';

  if (provider.host && provider.host.indexOf('127.0.0.1') !== -1) return 'localhost';

  return 'unknown';
}
