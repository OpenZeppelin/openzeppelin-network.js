declare module 'ethereumjs-wallet' {
  function generate(): Wallet;

  class Wallet {
    privKey: Buffer;
    getAddress(): Buffer;
  }
}
