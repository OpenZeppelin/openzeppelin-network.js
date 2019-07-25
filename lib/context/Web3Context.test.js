"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var Web3Context_1 = __importDefault(require("./Web3Context"));
var sleep_1 = __importDefault(require("../util/sleep"));
var localConnection = 'http://localhost:7545';
var accounts = ['0x48d21Dc6BBF18288520E9384aA505015c26ea43C'];
var context;
beforeEach(function () {
    jest.resetAllMocks();
    jest.useFakeTimers();
    context = new Web3Context_1.default(new web3_1.default(localConnection).currentProvider, { timeout: 100, pollInterval: 500 });
});
describe('Web3Context', function () {
    describe('Web3Context constructor', function () {
        it('creates Web3Context', function () {
            expect(context).not.toBeNull();
            expect(context.lib).not.toBeNull();
        });
    });
    describe('startPoll method', function () {
        it('starts poll', function () {
            context.startPoll();
            expect(setTimeout).toHaveBeenCalled();
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
            // @ts-ignore
            expect(context.pollHandle).toBeTruthy();
        });
    });
    describe('stopPoll method', function () {
        it('stops poll', function () {
            // @ts-ignore
            context.pollHandle = 14322;
            context.stopPoll();
            expect(clearTimeout).toHaveBeenCalled();
            // @ts-ignore
            expect(clearTimeout).toHaveBeenLastCalledWith(context.pollHandle);
        });
    });
    describe('poll method', function () {
        describe('when web3 provider is alive', function () {
            it('polls fresh data', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context.lib.eth.net.getId = jest.fn(function () { return Promise.resolve(1); });
                            context.lib.eth.getAccounts = jest.fn(function () { return Promise.resolve(accounts); });
                            context.emit = jest.fn();
                            return [4 /*yield*/, context.poll()];
                        case 1:
                            _a.sent();
                            expect(context.lib.eth.net.getId).toHaveBeenCalled();
                            expect(context.networkId).toBe(1);
                            expect(context.networkName).toBe('Main');
                            expect(context.lib.eth.getAccounts).toHaveBeenCalled();
                            expect(context.accounts).toBe(accounts);
                            expect(context.connected).toBe(true);
                            expect(context.emit).toHaveBeenCalledTimes(3);
                            expect(setTimeout).toHaveBeenCalled();
                            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
                            // @ts-ignore
                            expect(context.pollHandle).toBeTruthy();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when web3 provider is dead', function () {
            it('updates state', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context.lib.eth.net.getId = jest.fn(function () { return Promise.reject('nope'); });
                            context.lib.eth.getAccounts = jest.fn(function () { return Promise.reject('nope'); });
                            context.emit = jest.fn();
                            return [4 /*yield*/, context.poll()];
                        case 1:
                            _a.sent();
                            expect(context.lib.eth.net.getId).toHaveBeenCalled();
                            expect(context.lib.eth.getAccounts).not.toHaveBeenCalled();
                            expect(context.networkId).toBe(null);
                            expect(context.networkName).toBe(null);
                            expect(context.accounts).toBe(null);
                            expect(context.connected).toBe(false);
                            expect(context.emit).toHaveBeenCalledTimes(1);
                            expect(setTimeout).toHaveBeenCalled();
                            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
                            // @ts-ignore
                            expect(context.pollHandle).toBeTruthy();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when web3 provider timeouts', function () {
            it('updates state', function () { return __awaiter(_this, void 0, void 0, function () {
                var pollPromise;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context.lib.eth.net.getId = jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sleep_1.default(100 * 1000)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, Promise.resolve(1)];
                                    }
                                });
                            }); });
                            context.lib.eth.getAccounts = jest.fn(function () { return Promise.resolve(accounts); });
                            context.emit = jest.fn();
                            pollPromise = context.poll();
                            jest.runOnlyPendingTimers();
                            return [4 /*yield*/, pollPromise];
                        case 1:
                            _a.sent();
                            expect(context.lib.eth.net.getId).toHaveBeenCalled();
                            expect(context.lib.eth.getAccounts).not.toHaveBeenCalled();
                            expect(context.networkId).toBe(null);
                            expect(context.networkName).toBe(null);
                            expect(context.accounts).toBe(null);
                            expect(context.connected).toBe(false);
                            expect(context.emit).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('requestAuth method', function () {
        describe('requests auth with proper provider', function () {
            it('success if user approve', function () { return __awaiter(_this, void 0, void 0, function () {
                var send, retVal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            send = jest.fn(function (req, res) {
                                res(null, { result: accounts });
                            });
                            context.lib.currentProvider.send = send;
                            return [4 /*yield*/, context.requestAuth()];
                        case 1:
                            retVal = _a.sent();
                            expect(retVal).toBe(accounts);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('throws if user reject', function () { return __awaiter(_this, void 0, void 0, function () {
                var send;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            send = jest.fn(function (req, res) {
                                res({ error: 'nope' }, {});
                            });
                            context.lib.currentProvider.send = send;
                            return [4 /*yield*/, expect(context.requestAuth()).rejects.toMatchObject({
                                    error: 'nope',
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('fails with wrong provider', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete context.lib.currentProvider.constructor.prototype.send;
                        return [4 /*yield*/, expect(context.requestAuth()).rejects.toMatchObject({
                                message: "Web3 provider doesn't support send method",
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=Web3Context.test.js.map