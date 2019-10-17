#!/usr/bin/env node
declare const request: any;
declare const chalk: any;
declare const clear: any;
declare const figlet: any;
declare const path: any;
declare const program: any;
declare const inquirer: any;
declare var swagger: any, api: any, url: any, host: String, ans: any;
declare var konguri: string;
declare var readYaml: any;
declare function main(): Promise<void>;
declare function printData(): void;
declare function getinput(): Promise<void>;
declare function rel(): Promise<void>;
declare function getpaths(data: any): void;
declare function createService(name: any, host: any): Promise<void>;
declare function createRoute(uri: any, host: any): void;
