"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNetworkName(networkId) {
    switch (networkId) {
        //  0: Olympic, Ethereum public pre-release PoW testnet
        case 0:
            return 'Olympic';
        // 1: Frontier, Homestead, Metropolis, the Ethereum public PoW main network
        case 1:
            return 'Main';
        // 3: Ropsten, the public cross-client Ethereum PoW testnet
        case 3:
            return 'Ropsten';
        // 4: Rinkeby, the public Geth-only PoA testnet
        case 4:
            return 'Rinkeby';
        // 5: Goerli, the public cross-client PoA testnet
        case 5:
            return 'Goerli';
        // 6: Kotti Classic, the public cross-client PoA testnet for Classic
        case 6:
            return 'Kotti';
        // 8: Ubiq, the public Gubiq main network with flux difficulty chain ID 8
        case 8:
            return 'Ubiq';
        // 42: Kovan, the public Parity-only PoA testnet
        case 42:
            return 'Kovan';
        // 60: GoChain, the GoChain networks mainnet
        case 60:
            return 'GoChain';
        // 77: Sokol, the public POA Network testnet
        case 77:
            return 'Sokol';
        // 99: Core, the public POA Network main network
        case 99:
            return 'Core';
        // 100: xDai, the public MakerDAO/POA Network main network
        case 100:
            return 'xDai';
        // 31337: GoChain testnet, the GoChain networks public testnet
        case 31337:
            return 'GoChain';
        // 401697: Tobalaba, the public Energy Web Foundation testnet
        case 401697:
            return 'Tobalaba';
        // 7762959: Musicoin, the music blockchain
        case 7762959:
            return 'Musicoin';
        // 61717561: Aquachain, ASIC resistant chain
        case 61717561:
            return 'Aquachain';
        default:
            return 'Private';
    }
}
exports.default = getNetworkName;
//# sourceMappingURL=network.js.map