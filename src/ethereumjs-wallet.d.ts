declare module 'ethereumjs-wallet' {
  function generate(): Wallet;

  class Wallet {
    public privKey: Buffer;
    public getAddress(): Buffer;
  }
}
