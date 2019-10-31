#!/usr/bin/env node
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
var request = require('request');
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var swagger, api, url, host, ans, seviceID;
var konguri = "http://localhost:8001/services/";
var readYaml = require('read-yaml');
//const mongoose = require('mongoose');
var Quotas = require('./models/mapper');
var Oauth2 = require('./models/oauth');
//const QuotaR = require('./models/rateRoute')
var ApiKey = require('./models/apiKey');
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //console.log(appl)
                    printData();
                    return [4 /*yield*/, getinput()
                        //console.log("Qoutdsadsadsad:",quotas)
                        //console.log(quota)
                    ];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//Printing the basic information
function printData() {
    try {
        clear();
        console.log(chalk.red(figlet.textSync('Wso2', { horizontalLayout: 'full' })));
    }
    catch (e) {
        console.log("Something went wrong");
    }
}
//taking the input from the swager file
//need to updathe the function to be able read files in .json and .yml format
function getinput() {
    return __awaiter(this, void 0, void 0, function () {
        var questions, Error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    questions = [{
                            type: 'input',
                            name: 'name',
                            message: "Enter the Kong-Gateway URL ",
                            default: "http://localhost:8001/services/"
                        }];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    ans = _a.sent();
                    return [4 /*yield*/, ans.name];
                case 2:
                    konguri = _a.sent();
                    return [4 /*yield*/, rel()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    Error_1 = _a.sent();
                    console.log("Error While Taking the input");
                    console.log(Error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//Reding the yaml file and tehn creating the service in Kong
function rel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                readYaml('swagger.yaml', function (err, data) {
                    return __awaiter(this, void 0, void 0, function () {
                        var tags, _a, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    console.log("Unable To Read the Swagger File");
                                    return [3 /*break*/, 8];
                                case 1: return [4 /*yield*/, data];
                                case 2:
                                    swagger = _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, 7, , 8]);
                                    host = swagger.schemes["0"] + "://" + swagger.host + swagger.basePath + "/";
                                    url = konguri + data.info.title + "/routes";
                                    if (!(data.tags != null)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, addtags(data.tags)];
                                case 4:
                                    _a = _b.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    _a = [];
                                    _b.label = 6;
                                case 6:
                                    tags = _a;
                                    createService(data.info.title, host, tags);
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_1 = _b.sent();
                                    console.log("Please make sure the Swagger filr contains the following fileds");
                                    console.log("1.Schemse 2.Host 3.BasePath");
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            catch (Error) {
                console.log("Error While reading the swagger file");
            }
            return [2 /*return*/];
        });
    });
}
function addtags(data) {
    return __awaiter(this, void 0, void 0, function () {
        var tags, tag;
        return __generator(this, function (_a) {
            try {
                tags = [];
                for (tag in data)
                    tags.push(data[tag].name);
                return [2 /*return*/, tags];
            }
            catch (e) {
                console.log("No tags in the Swagger File");
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
function createService(name, host, tags) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            options = {
                method: 'POST',
                url: konguri,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    name: name,
                    url: host,
                    tags: tags,
                    undefined: undefined
                },
                json: true
            };
            try {
                request(options, function (error, response, body) {
                    return __awaiter(this, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!error) return [3 /*break*/, 1];
                                    console.log("Unable To Send the Request to create the Service");
                                    return [3 /*break*/, 6];
                                case 1: return [4 /*yield*/, body];
                                case 2:
                                    data = _a.sent();
                                    if (!(data.id == null)) return [3 /*break*/, 3];
                                    console.log("Service Name Alredy Exits");
                                    return [3 /*break*/, 6];
                                case 3: return [4 /*yield*/, data.id];
                                case 4:
                                    seviceID = _a.sent();
                                    return [4 /*yield*/, addSecurity(swagger.securityDefinitions, seviceID)
                                        //await addPlugins()
                                    ];
                                case 5:
                                    _a.sent();
                                    //await addPlugins()
                                    console.log("Service Created");
                                    console.log("Service ID   :", data.id);
                                    console.log("Service Name :", data.name);
                                    createRoute(url, swagger.info.title);
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            catch (error) {
                console.log("Unable to Send the Curl command");
            }
            return [2 /*return*/];
        });
    });
}
// Creating the Host and trigering the process of genarating routes
function createRoute(uri, host) {
    var options = {
        method: 'POST',
        url: uri,
        form: { 'hosts[]': host, undefined: undefined }
    };
    request(options, function (error, response, body) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!error) return [3 /*break*/, 1];
                        console.log("Unable To Send the Request to create the Service");
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, JSON.parse(body)];
                    case 2:
                        data = _a.sent();
                        console.log("Host Created");
                        console.log("Host ID   :", data.id);
                        console.log("Host Name :", data.hosts["0"]);
                        getpaths(swagger.paths);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
}
// loop thrugh swageer file and identifin ng routes and mothords associate to the route
function getpaths(data) {
    return __awaiter(this, void 0, void 0, function () {
        var route, methrdList, methord, string;
        return __generator(this, function (_a) {
            for (route in data) {
                methrdList = [];
                //console.log("route is:", route)
                for (methord in data[route]) {
                    string = new String(methord);
                    methrdList.push(string.toLocaleUpperCase());
                }
                //console.log("Methord list", methrdList)
                createPaths(url, swagger.info.title, route, methrdList);
            }
            return [2 /*return*/];
        });
    });
}
function createPaths(uri, host, pathName, methordList) {
    var name = pathName.replace(/\W/g, '');
    var options = {
        method: 'POST',
        url: uri,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { name: name, paths: [pathName], methods: methordList, strip_path: false },
        json: true
    };
    request(options, function (error, response, body) {
        return __awaiter(this, void 0, void 0, function () {
            var routeID, meth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error)
                            throw new Error(error);
                        return [4 /*yield*/, body.id];
                    case 1:
                        routeID = _a.sent();
                        if (!(routeID == null)) return [3 /*break*/, 2];
                        console.log("Route Name Alredy Exits");
                        return [3 /*break*/, 4];
                    case 2:
                        meth = methordList[0];
                        console.log("Route Created");
                        console.log("Route   ID :", routeID);
                        console.log("Service ID :", body.service.id);
                        if (!(swagger.paths[pathName][meth.toLocaleLowerCase()]["x-throttling-tier"] != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ceratePluginQuotaAtRouteLevel(swagger.paths[pathName][meth.toLocaleLowerCase()]["x-throttling-tier"], routeID)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
}
function newPlugin(uri, data) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            try {
                options = {
                    method: 'POST',
                    url: uri,
                    headers: {
                        Host: 'localhost:8001',
                        Accept: '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: data, json: true
                };
                //console.log(data)
                request(options, function (error, response, body) {
                    return __awaiter(this, void 0, void 0, function () {
                        var routeID;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error)
                                        throw new Error(error);
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
//need to update the above function to add different flows 
function ceratePluginQuotaAtRouteLevel(data, routeID) {
    return __awaiter(this, void 0, void 0, function () {
        var rateLimit, quotas, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rateLimit = parseInt(data) * 1000;
                    return [4 /*yield*/, new Quotas({ "route": { "id": routeID }, config: { "minute": rateLimit } })];
                case 1:
                    quotas = _a.sent();
                    target = "http://localhost:8001/routes/" + routeID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, quotas)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addSecurity(data, serviceID) {
    return __awaiter(this, void 0, void 0, function () {
        var security;
        return __generator(this, function (_a) {
            for (security in data) {
                if (data[security].type == "oauth2")
                    createPluginOauth(serviceID, data[security].flow);
                else if (data[security].type == 'apiKey')
                    createPluginApiKey(serviceID, data[security].name);
            }
            return [2 /*return*/];
        });
    });
}
function createPluginOauth(serviceID, flow) {
    return __awaiter(this, void 0, void 0, function () {
        var body, body, body, body, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(flow == "implicit")) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Oauth2({ service: { "id": seviceID }, config: { "enable_implicit_grant": true } })];
                case 1:
                    body = _a.sent();
                    return [3 /*break*/, 8];
                case 2:
                    if (!(flow == 'password')) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Oauth2({ service: { "id": seviceID }, config: { "enable_password_grant": true } })];
                case 3:
                    body = _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    if (!(flow == 'application')) return [3 /*break*/, 6];
                    return [4 /*yield*/, new Oauth2({ service: { "id": seviceID }, config: { "enable_client_credentials": true } })];
                case 5:
                    body = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, new Oauth2({ service: { "id": seviceID }, config: { "enable_authorization_code": true } })
                    //console.log("Details are",body)
                ];
                case 7:
                    body = _a.sent();
                    _a.label = 8;
                case 8:
                    target = "http://localhost:8001/services/" + serviceID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, body)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createPluginApiKey(serviceID, name) {
    return __awaiter(this, void 0, void 0, function () {
        var body, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new ApiKey({ service: { "id": seviceID }, config: { "key_names": [name] } })];
                case 1:
                    body = _a.sent();
                    target = "http://localhost:8001/services/" + serviceID + "/plugins";
                    return [4 /*yield*/, newPlugin(target, body)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/*async function addPlugins() {
  var data = swagger['x-wso2-policies']
  var plugins: any
  for (plugins in data) {
    //console.log(plugins , ":" , data[plugins].isenabled)
    if (data[plugins].isenabled)
      //console.log("Deploying the plugin",plugins)
      if (plugins == 'quota') {
        createPluginQuotaAtApiLevel('rate-limiting', url, data[plugins])
      }
      //if (plugins == 'apiSecurity')
     // createPluginOauth(data[plugins])
  }
}

async function createPluginQuotaAtApiLevel(policy: any, uri: any, data: any) {
  var rateLimit = parseInt(data.apiLevelPolicy) * 1000
  var quotas = await new Quotas({ "service": { "id": seviceID }, config: { "minute": rateLimit } })
  var target = await `http://localhost:8001/services/${seviceID}/plugins`
  await newPlugin(target, quotas)
}
*/ 
