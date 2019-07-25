# openzeppelin-network.js
An easy to use and reliable library that provides one line access to Web3 API.
* Hides various Web3 providers behind common API
* One line access to the Web3 providers (Metamask, Infura, Geth, Portis and etc)
* Supports multiple Web3 providers within the same app
* First class support of meta-txs
* React integration using hooks
* Network, accounts, and connection changed events for all web3 providers

### Quickstart

#### Install

```
npm i @openzeppelin/network
```

#### Use
Import the library:
```
import { useWeb3Injected, useWeb3Network } from '@openzeppelin/network';
````
Get Web3Context with React Hooks inside functional component:
```
  const injected = useWeb3Injected();
  const local = useWeb3Network('http://127.0.0.1:8545');
```

Use Web3Context to get fresh data and receive events:
```
const { accounts, networkId, networkName, providerName, lib, connected } = web3Context;
this.setState({ accounts, networkId, networkName, providerName, lib, connected });
```

Subscribe to events to get notified:
```
web3Context.on(Web3Context.NetworkIdChangedEventName, (networkId, networkName) => {
            setNetwork({ networkId, networkName });
          });
web3Context.on(Web3Context.AccountsChangedEventName, async accounts => {
            setWallet({ accounts, balance: await getBalance(web3Context) });
          });
```

#### Learn more
##### [Starter Kit](https://github.com/OpenZeppelin/starter-kit/tree/stable)
Run `openzeppelin unpack starter` inside empty directory and follow the instructions.