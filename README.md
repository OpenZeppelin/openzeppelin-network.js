# openzeppelin-network.js
[![CircleCI](https://circleci.com/gh/OpenZeppelin/openzeppelin-network.js.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-network.js)
[![npm (scoped)](https://img.shields.io/npm/v/@openzeppelin/network)](https://www.npmjs.com/package/@openzeppelin/network)

**One line access to Web3 in your dApp.**

 * Hides various Web3 providers behind common API.
 * One line access to the Web3 providers (Metamask, Infura, Geth, Portis and etc).
 * Supports multiple Web3 providers within the same app.
 * First class support of meta-txs.
 * React integration using hooks.
 * Network, accounts, and connection changed events for all web3 providers.
 * Will fire events even for HTTP and forcefully terminated providers.

## Overview

### Installation

```console
npm install @openzeppelin/network
```

### Usage

#### With React Hooks
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

#### With Vanilla Javascript
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

## Learn More

 * Try it out on the [GSN Starter Kit](https://docs.openzeppelin.com/starter-kits/gsnkit): run `npx @openzeppelin/cli unpack gsn` in a new directory and follow the instructions.
 * For detailed usage information, take a look at the [API Reference](https://docs.openzeppelin.com/network-js/api).

## License

Released under the MIT License.
