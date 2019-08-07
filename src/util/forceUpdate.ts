import { useReducer, Dispatch } from 'react';

export default function useForceUpdate(): Dispatch<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, forceUpdate] = useReducer((x, _: unknown): number => x + 1, 0);
  return forceUpdate;
}
