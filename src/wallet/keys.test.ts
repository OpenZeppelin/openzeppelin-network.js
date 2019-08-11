import { ephemeral } from './keys';

describe('ephemeral function', (): void => {
  it('generates a keypair', (): void => {
    const keypair = ephemeral();

    expect(keypair.privateKey).not.toBeNull();
    expect(keypair.privateKey).toBeInstanceOf(Buffer);

    expect(keypair.address).not.toBeNull();
    expect(keypair.address).toMatch(/0x/);
  });
});
