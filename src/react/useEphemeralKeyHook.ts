import { useState } from 'react';

import { ephemeral, KeyPair } from '../wallet/keys';

export function useEphemeralKey(): KeyPair {
  const [keyPair] = useState(ephemeral);
  return keyPair;
}
