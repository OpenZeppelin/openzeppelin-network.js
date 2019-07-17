import sleep from './sleep';

export default async function timeout<T>(target: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    target,
    new Promise<T>(
      async (resolve, reject): Promise<void> => {
        await sleep(ms);
        reject(new Error(`Function has timed out with the limit of ${ms} milliseconds.`));
      },
    ),
  ]);
}
