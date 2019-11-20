# openzeppelin-network.js
[![CircleCI](https://circleci.com/gh/OpenZeppelin/openzeppelin-network.js.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-network.js)
[![npm (scoped)](https://img.shields.io/npm/v/@openzeppelin/network)](https://www.npmjs.com/package/@openzeppelin/network)

An easy to use and reliable library that provides one line access to Web3 API.
* Hides various Web3 providers behind common API.
* One line access to the Web3 providers (Metamask, Infura, Geth, Portis and etc).
* Supports multiple Web3 providers within the same app.
* First class support of meta-txs.
* React integration using hooks.
* Network, accounts, and connection changed events for all web3 providers.
* Will fire events even for HTTP and forcefully terminated providers.

## Quickstart

### Install

```bash
npm i @openzeppelin/network
```

### Use with React Hooks
Import the library:

```javascript
import { useWeb3Injected, useWeb3Network, useEphemeralKey } from '@openzeppelin/network/react';
```

Get Web3Context with React Hooks inside functional component:

```javascript
const injected = useWeb3Injected();
const local = useWeb3Network('http://127.0.0.1:8545');
```

Use `Web3Context` to get fresh data:

```javascript
const { accounts, networkId, networkName, providerName, lib, connected } = web3Context;
```

Network.js will re-render component when network, accounts or connetion state change.

To use GSN with any hook specify GSN as an option, providing a signing key:

```typescript
const local = useWeb3Network('http://127.0.0.1:8545', { 
  gsn: { signKey: useEphemeralKey() } 
});
```

### Use with Vanilla Javascript
Import the library:

```javascript
import { fromInjected, fromConnection } from '@openzeppelin/network';
```

Get `Web3Context`:

```javascript
const injected = await fromInjected();
const local = await fromConnection('http://127.0.0.1:8545');
```

To use GSN include a `gsn` option, including a signing key:

```typescript
const local = await fromConnection('http://127.0.0.1:8545', { 
  gsn: { signKey: ephemeral() } 
});
```

Use `Web3Context` to get fresh data immediately:

```javascript
const { accounts, networkId, networkName, providerName, lib, connected } = web3Context;
```

Subscribe to events to get notified:

```javascript
function updateNetwork(networkId, networkName) {}
function updateAccounts(accounts) {}
function updateConnection(connected) {}

web3Context.on(Web3Context.NetworkIdChangedEventName, updateNetwork);
web3Context.on(Web3Context.AccountsChangedEventName, updateAccounts);
web3Context.on(Web3Context.ConnectionChangedEventName, updateConnection);
```

Unsubscribe from events once you don't need them:

```javascript
web3Context.off(Web3Context.NetworkIdChangedEventName, updateNetwork);
web3Context.off(Web3Context.AccountsChangedEventName, updateAccounts);
web3Context.off(Web3Context.ConnectionChangedEventName, updateConnection);

```

### Learn more
#### Learn by example at [Starter Kit](https://github.com/OpenZeppelin/starter-kit/tree/stable)
Run `openzeppelin unpack starter` inside empty directory and follow the instructions.

## API

### React Hooks

```typescript
function useWeb3Injected(options?: Web3ContextOptions): Web3Context
```
Returns Web3Context built from an injected provider like MetaMask. Will re-render on accounts, network, and connection change.

```typescript
function useWeb3Network(connection: string, options?: Web3ContextOptions): Web3Context
```

Returns Web3Context built from a connection string like Infura or a private node. Will re-render on accounts, network, and connection change.

```typescript
function useWeb3(fallbackConnection: string, options?: Web3ContextOptions): Web3Context
```
Tries to retrive an web3 injected provider first if fails falls back on a network connection. Will re-render on accounts, network, and connection change.

```typescript
function useEphemeralKey(): KeyPair
```
Generates in memory private/public key pair.

### Helpers

```typescript
async function fromConnection(connection: string, options?: Web3ContextOptions): Promise<Web3Context>
```
Creates fully initialized `Web3Context` from a connection string to a node or a service like Infura.

```typescript
async function fromInjected(options?: Web3ContextOptions): Promise<Web3Context>
```

Creates fully initialized `Web3Context` from an injected web3 provider, like MetMask.

### WebContextOptions

```typescript
export interface Web3ContextOptions {
  timeout: number;
  pollInterval: number;
  gsn: boolean | object;
}
```

`timeout` specifies wait time for underlying web3 provider calls before considering them failed.  
`pollInteral` is how often data will be polled from an underlying web3 provider. For network providers you might want to set this parameter manually to control a network load.  
`gsn` if set a GSN provider will be use. Pass an object to  set GSN provider options.  

### Web3Context
`Web3Context` class is reponsible for polling web3 providers, firing events, enabling GSN, and keeping data fresh. Typically you shouldn't call any methods on Web3Context yourself. Use React Hooks or helper methods.

#### Properties
```typescript
  public readonly lib: Web3;
```
An initialized instance of web3.js.

```typescript
  public connected: boolean;
```
Indicated if underlying provider available or not.

```typescript
  public accounts: string[] | null;
```
Provides an instant access to the accounts of a web3 provider. If an array is empty then accounts either locked or not avaiable on a web3 provider.

```typescript
  public networkId: number | null;
```
Id of a current network.

```typescript
  public networkName: string | null;
```
A current network human-readable name, for example: Main, Ropsten.

```typescript
  public readonly providerName: string;
```
A current web3 provider human-readable name, for example: metamask, infura.

#### Methods

```typescript
public startPoll(): void
```
Starts polling data from web3 provider and firing events on change. Typically you shouldn't call this method directly.

```typescript
public stopPoll(): void
```
Stops polling data and firing events. Typically you shouldn't call this method directly.

```typescript
public async poll(): Promise<void>
```
Updates data and fires events only once. Typically you shouldn't call this method directly.

```typescript
public async requestAuth(): Promise<string[]>
```
Request access to the accounts of an underlying web3 provider according to the [EIP-1102](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md). Typically you shouldn't call this method directly.

## License

Released under the MIT License.
