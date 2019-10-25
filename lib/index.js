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
var map = require('./models/mapper');
var apple = '10kperminiute';
var appl = parseInt(apple) * 1000;
main();
console.log(map);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(appl);
                    printData();
                    return [4 /*yield*/, getinput()];
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
        console.log(chalk.red(figlet.textSync('WSO2', { horizontalLayout: 'full' })));
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
                    addPlugins();
                    return [3 /*break*/, 5];
                case 4:
                    Error_1 = _a.sent();
                    console.log("Error While Taking the input");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function rel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                readYaml('swagger.yaml', function (err, data) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (err)
                                console.log("Unable To Read the Swagger File");
                            else {
                                swagger = data;
                                host = swagger.schemes["0"] + "://" + swagger.host + swagger.basePath;
                                url = konguri + data.info.title + "/routes";
                                createService(data.info.title, host);
                            }
                            return [2 /*return*/];
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
function getpaths(data) {
    return __awaiter(this, void 0, void 0, function () {
        var result, route, methrdList, methord, string;
        return __generator(this, function (_a) {
            for (route in data) {
                methrdList = [];
                console.log("route is:", route);
                //console.log("routeDatais",data[route])
                for (methord in data[route]) {
                    string = new String(methord);
                    methrdList.push(string.toLocaleUpperCase());
                }
                console.log("Methord list", methrdList);
                result = createPaths(url, swagger.info.title, route, methrdList);
            }
            return [2 /*return*/];
        });
    });
}
function createService(name, host) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            options = {
                method: 'POST',
                url: konguri,
                form: {
                    name: name,
                    url: host,
                    undefined: undefined
                }
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
                                    return [3 /*break*/, 5];
                                case 1: return [4 /*yield*/, JSON.parse(body)];
                                case 2:
                                    data = _a.sent();
                                    if (!(data.id == null)) return [3 /*break*/, 3];
                                    console.log("Service Name Alredy Exits");
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, data.id
                                    //console.log("Service Created", data)
                                ];
                                case 4:
                                    seviceID = _a.sent();
                                    //console.log("Service Created", data)
                                    console.log("Service ID   :", data.id);
                                    console.log("Service Name :", data.name);
                                    createRoute(url, swagger.info.title);
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
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
                        console.log("Route Created");
                        console.log("Route ID   :", data.id);
                        console.log("Route Hosts :", data.hosts["0"]);
                        getpaths(swagger.paths);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
}
function createPaths(uri, host, pathName, methordList) {
    var options = { method: 'POST',
        url: uri,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { paths: [pathName], methods: methordList, strip_path: false },
        json: true };
    request(options, function (error, response, body) {
        if (error)
            throw new Error(error);
        console.log(body);
    });
}
function addPlugins() {
    var plugins;
    for (plugins in swagger['x-wso2-policies']) {
        console.log(plugins);
        if (plugins.isenabled)
            console.log("Deploying the plugin", plugins);
    }
}
