import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { mocked } from 'ts-jest/utils';

test('basic', (): void => {
  expect(2 + 2).toBe(4);
});

// describe('fromConnection function', (): void => {
//   beforeEach((): void => {
//     // mocked(Web3).mockImplementation(
//     //   (provider: string): Web3 => {
//     //     return function(): string {
//     //       return localConnection;
//     //     };
//     //   },
//     // // );
//     // mocked(Web3Context).mockImplementation((): object => {
//     //   return {};
//     // });
//     // const mockedWeb3Context = mocked(module.Web3Context);
//     // module.Web3Context.prototype.poll = jest.fn().mockImplementation(
//     //   (): Promise<void> => {
//     //     return Promise.resolve();
//     //   },
//     // );
//   });
//   it('creates Web3 context from connection', async (): Promise<void> => {
//     const context = await fromConnection(localConnection);
//     expect(context).not.toBeNull();
//   });
// });
