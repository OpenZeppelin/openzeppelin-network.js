import Web3Context, { Web3ContextOptions } from './Web3Context';
import * as providers from '../providers';

export async function fromConnection(connection: string, options?: Web3ContextOptions): Promise<Web3Context> {
  const context = new Web3Context(providers.connection(connection), options);
  await context.poll();
  context.startPoll();

  return context;
}

export async function fromInjected(options?: Web3ContextOptions): Promise<Web3Context> {
  const context = new Web3Context(providers.injected(), options);
  await context.poll();
  context.startPoll();

  return context;
}
