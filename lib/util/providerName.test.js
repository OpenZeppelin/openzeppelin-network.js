"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var providerName_1 = __importDefault(require("./providerName"));
describe('getProviderName function', function () {
    it('gets name of the provider', function () {
        var provider = { isMetaMask: true };
        var providerName = providerName_1.default(provider);
        expect(providerName).toBe('metamask');
    });
});
//# sourceMappingURL=providerName.test.js.map