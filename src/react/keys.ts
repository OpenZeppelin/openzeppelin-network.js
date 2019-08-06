import { useState } from 'react';

import { ephemeral, KeyPair } from '../keys';

export function useEphemeralKey(): KeyPair {
  const [keyPair] = useState(ephemeral);
  return keyPair;
}
