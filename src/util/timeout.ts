import sleep from './sleep';

export default async function timeout<T>(target: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    target,
    (async () => {
      await sleep(ms);
      // TODO: Figure out how to print function name
      throw new Error(`Function has timed out with the limit of ${ms} milliseconds.`);
    })(),
  ]);
}
