import wallet from 'ethereumjs-wallet';

export interface KeyPair {
  privateKey: Buffer;
  address: string;
}

export function ephemeral(): KeyPair {
  const w = wallet.generate();
  return {
    privateKey: w.privKey,
    address: "0x" + w.getAddress().toString('hex')
  };
}
