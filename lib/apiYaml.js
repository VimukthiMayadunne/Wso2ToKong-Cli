"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var readYaml = require("read-yaml");
var QuotaS = require("./models/mapper");
var CORS = require("./models/CORS");
var request = require("request");
var cache = require("./models/cache");
function readApiYaml() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (reslove, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                readYaml("api.yaml", function (err, data) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var apiYaml;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!err) return [3 /*break*/, 1];
                                                    console.log("APi.YAML flie is not avilable");
                                                    return [3 /*break*/, 3];
                                                case 1: return [4 /*yield*/, data];
                                                case 2:
                                                    apiYaml = _a.sent();
                                                    reslove(apiYaml);
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                });
                            }
                            catch (Error) {
                                console.log("Error While reading the swagger file", Error);
                                return [2 /*return*/, reject(Error)];
                            }
                            return [2 /*return*/];
                        });
                    });
                })];
        });
    });
}
function addPlugins(data, serviceID) {
    (data.apiLevelPolicy != "Unlimited") ? createPluginQuotaAtApiLevel(data.apiLevelPolicy, serviceID) : console.log("Unlimited Trotaling");
    (data.corsConfiguration.corsConfigurationEnabled) ? createPluginCorss(data.corsConfiguration, serviceID) : console.log("cors is Disabled");
    (data.responseCache == "Enabled") ? createPluginCache(data.cacheTimeout, serviceID) : console.log("Cashe Disabled");
}
function createPluginQuotaAtApiLevel(data, serviceID) {
    return __awaiter(this, void 0, void 0, function () {
        var rateLimit, quotas, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rateLimit = parseInt(data) * 1000;
                    console.log("Rate:", rateLimit);
                    return [4 /*yield*/, new QuotaS({ service: { id: serviceID }, config: { minute: rateLimit } })];
                case 1:
                    quotas = _a.sent();
                    target = "http://localhost:8001/services/" + serviceID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, quotas)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createPluginCorss(data, serviceID) {
    return __awaiter(this, void 0, void 0, function () {
        var corsD, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new CORS({ service: { id: serviceID }, config: { methods: data.accessControlAllowMethods, headers: data.accessControlAllowHeaders, origins: data.accessControlAllowOrigins, credentials: data.accessControlAllowCredentials } })];
                case 1:
                    corsD = _a.sent();
                    target = "http://localhost:8001/services/" + serviceID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, corsD)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createPluginCache(data, serviceID) {
    return __awaiter(this, void 0, void 0, function () {
        var corsD, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new cache({ service: { id: serviceID }, config: { cache_ttl: data } })];
                case 1:
                    corsD = _a.sent();
                    target = "http://localhost:8001/services/" + serviceID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, corsD)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function newPlugin(uri, data) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            try {
                options = {
                    method: "POST",
                    url: uri,
                    headers: {
                        "Host": "localhost:8001",
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                    body: data, json: true,
                };
                request(options, function (error, response, body) {
                    return __awaiter(this, void 0, void 0, function () {
                        var routeID;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error) {
                                        throw new Error(error);
                                    }
                                    return [4 /*yield*/, body.id];
                                case 1:
                                    routeID = _a.sent();
                                    console.log("Pulgin Created");
                                    console.log("Plugin Name", body.name);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            catch (error) {
                console.log("Unable to Create the Plugin");
            }
            return [2 /*return*/];
        });
    });
}
module.exports = { readApiYaml: readApiYaml, addPlugins: addPlugins };
