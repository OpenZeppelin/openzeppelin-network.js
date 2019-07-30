"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var events_1 = require("events");
var timeout_1 = __importDefault(require("../util/timeout"));
var network_1 = __importDefault(require("../util/network"));
var providerName_1 = __importDefault(require("../util/providerName"));
// TODO: Change event to use types using conditional types
var Web3Context = /** @class */ (function (_super) {
    __extends(Web3Context, _super);
    function Web3Context(provider, options) {
        var _this = _super.call(this) || this;
        _this.connected = false;
        _this.accounts = [];
        _this.networkId = null;
        _this.networkName = null;
        options = Object.assign({}, { timeout: 3000, pollInterval: 500 }, options);
        if (!provider)
            throw new Error('A web3 provider has to be defined');
        _this.providerName = providerName_1.default(provider);
        _this.lib = new web3_1.default(provider);
        _this.timeout = options.timeout;
        _this.pollInterval = options.pollInterval;
        return _this;
    }
    Web3Context.prototype.startPoll = function () {
        // TODO: polling interval should depend on kind of web3 provider
        // We can query local providers often but doing the same for the network providers may create a lot of overhead
        this.pollHandle = setTimeout(this.poll.bind(this), this.pollInterval);
    };
    Web3Context.prototype.stopPoll = function () {
        if (this.pollHandle)
            clearTimeout(this.pollHandle);
    };
    Web3Context.prototype.poll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var networkIdName, accountsName, connectedName, networkNameName, newNetworkId, newNetworkName_1, newAccounts, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkIdName = 'networkId';
                        accountsName = 'accounts';
                        connectedName = 'connected';
                        networkNameName = 'networkName';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, timeout_1.default(this.lib.eth.net.getId(), this.timeout)];
                    case 2:
                        newNetworkId = _a.sent();
                        newNetworkName_1 = network_1.default(newNetworkId);
                        this.updateValueAndFireEvent(newNetworkId, networkIdName, Web3Context.NetworkIdChangedEventName, function () { return [newNetworkName_1]; });
                        this.updateValueAndFireEvent(newNetworkName_1, networkNameName);
                        return [4 /*yield*/, timeout_1.default(this.lib.eth.getAccounts(), this.timeout)];
                    case 3:
                        newAccounts = _a.sent();
                        this.updateValueAndFireEvent(newAccounts, accountsName, Web3Context.AccountsChangedEventName);
                        // if web3 provider calls are success then we are connected
                        this.updateValueAndFireEvent(true, connectedName, Web3Context.ConnectionChangedEventName);
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        // provider methods fail so we have to update the state and fire the events
                        this.updateValueAndFireEvent(false, connectedName, Web3Context.ConnectionChangedEventName);
                        this.updateValueAndFireEvent(null, networkIdName, Web3Context.NetworkIdChangedEventName, function () { return [null]; });
                        this.updateValueAndFireEvent(null, networkNameName);
                        this.updateValueAndFireEvent(null, accountsName, Web3Context.AccountsChangedEventName);
                        return [3 /*break*/, 6];
                    case 5:
                        this.startPoll();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Web3Context.prototype.updateValueAndFireEvent = function (newValue, property, eventName, getArgs) {
        if (getArgs === void 0) { getArgs = function () { return []; }; }
        var typedThis = this;
        if (newValue !== typedThis[property]) {
            typedThis[property] = newValue;
            if (eventName)
                this.emit.apply(this, [eventName, this[property]].concat(getArgs()));
        }
    };
    // request access according to the EIP
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md
    Web3Context.prototype.requestAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Request authentication
                if (this.lib.currentProvider.send !== undefined) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var responseHandler = function (error, response) {
                                if (error || response.error) {
                                    reject(error || response.error);
                                }
                                else {
                                    resolve(response.result);
                                }
                            };
                            var send = _this.lib.currentProvider.send;
                            send({ method: 'eth_requestAccounts' }, responseHandler);
                        })];
                }
                else
                    return [2 /*return*/, Promise.reject(new Error("Web3 provider doesn't support send method"))];
                return [2 /*return*/];
            });
        });
    };
    Web3Context.NetworkIdChangedEventName = 'NetworkIdChanged';
    Web3Context.AccountsChangedEventName = 'AccountsChanged';
    Web3Context.ConnectionChangedEventName = 'ConnectionChanged';
    return Web3Context;
}(events_1.EventEmitter));
exports.default = Web3Context;
//# sourceMappingURL=Web3Context.js.map