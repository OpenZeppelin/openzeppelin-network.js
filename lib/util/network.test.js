"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = __importDefault(require("./network"));
describe('getNetworkName function', function () {
    it('return proper network names', function () {
        expect(network_1.default(1)).toBe('Main');
        expect(network_1.default(3)).toBe('Ropsten');
        expect(network_1.default(4)).toBe('Rinkeby');
        expect(network_1.default(42)).toBe('Kovan');
    });
});
//# sourceMappingURL=network.test.js.map