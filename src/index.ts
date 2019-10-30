#!/usr/bin/env node
const request = require('request');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer')
var swagger: any, api, url: any, host: String, ans, seviceID: any;
var konguri = "http://localhost:8001/services/"
var readYaml = require('read-yaml');
//const mongoose = require('mongoose');
const Quotas = require('./models/mapper')
const Oauth2 = require('./models/oauth')
const QuotaR = require('./models/rateRoute')


main()

async function main() {
  //console.log(appl)
  printData()
  await getinput()
  //console.log("Qoutdsadsadsad:",quotas)
  //console.log(quota)
}

//Printing the basic information
function printData() {
  try {
    clear()
    console.log(
      chalk.red(
        figlet.textSync('WSO2', { horizontalLayout: 'full' })
      )
    )
  }
  catch (e) {
    console.log("Something went wrong");
  }
}

//taking the input from the swager file
//need to updathe the function to be able read files in .json and .yml format
async function getinput() {
  try {
    var questions = [{
      type: 'input',
      name: 'name',
      message: "Enter the Kong-Gateway URL ",
      default: "http://localhost:8001/services/"
    }]
    ans = await inquirer.prompt(questions)
    konguri = await ans.name
    await rel()

  }
  catch (Error) {
    console.log("Error While Taking the input")
    console.log(Error)
  }
}

async function rel() {
  try {
    readYaml('swagger.yaml', async function (err: any, data: any) {
      if (err)
        console.log("Unable To Read the Swagger File")
      else {
        swagger = await data
        host = swagger.schemes["0"] + "://" + swagger.host + swagger.basePath
        url = konguri + data.info.title + "/routes"
        createService(data.info.title, host)
      }
    })
  }
  catch (Error) {
    console.log("Error While reading the swagger file")
  }
}

async function getpaths(data: any) {
  var result
  for (var route in data) {
    var methrdList = []
    //console.log("route is:", route)
    for (var methord in data[route]) {
      var string = new String(methord)
      methrdList.push(string.toLocaleUpperCase())
    }
    //console.log("Methord list", methrdList)
    result = await createPaths(url, swagger.info.title, route, methrdList)
  }
}

async function createService(name: any, host: any) {

  var options = {
    method: 'POST',
    url: konguri,
    form:
    {
      name: name,
      url: host,
      undefined: undefined
    }
  };
  try {
    request(options, async function (error: any, response: any, body: any) {
      if (error)
        console.log("Unable To Send the Request to create the Service")
      else {
        var data = await JSON.parse(body)
        if (data.id == null) {
          console.log("Service Name Alredy Exits")
        }
        else {
          seviceID = await data.id
          await addPlugins()
          //console.log("Service Created", data)
          console.log("Service ID   :", data.id)
          console.log("Service Name :", data.name)
          createRoute(url, swagger.info.title)
        }
      }
    });
  }
  catch (error) {
    console.log("Unable to Send the Curl command")
  }
}

// Creating the Host and trigering the process of genarating routes
function createRoute(uri: any, host: any) {

  var options = {
    method: 'POST',
    url: uri,
    form: { 'hosts[]': host, undefined: undefined }
  };

  request(options, async function (error: any, response: any, body: any) {
    if (error)
      console.log("Unable To Send the Request to create the Service")
    else {
      var data = await JSON.parse(body)
      console.log("Route Created")
      console.log("Route ID   :", data.id)
      console.log("Route Hosts :", data.hosts["0"])
      getpaths(swagger.paths)
      //console.log(body);
    }
  });
}

function createPaths(uri: any, host: any, pathName: any, methordList: any) {
  var options = {
    method: 'POST',
    url: uri,
    headers:
    {
      'Content-Type': 'application/json'
    },
    body: { paths: [pathName], methods: methordList, strip_path: false },
    json: true
  };

  request(options, async function (error: any, response: any, body: any) {
    if (error)
      throw new Error(error);
    var routeID = await body.id
    var meth:String = methordList[0]
    console.log("Route Created")
    console.log("Route   ID :", routeID)
    console.log("Service ID :",body.service.id)
    console.log("..............................")
    console.log("Tire is:",swagger.paths[pathName])
    console.log("Tire is:",)
    await ceratePluginQuotaAtRouteLevel(swagger.paths[pathName][meth.toLocaleLowerCase()]["x-throttling-tier"],routeID)
  });

}

async function addPlugins() {
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

async function createPluginOauth(data: any) {
  if (swagger.securityDefinitions.Oauth2.type == 'oauth2') {
    var body = await new Oauth2({ service: { id: seviceID } })
    //console.log("Details are",body)
    var target = await `http://localhost:8001/services/${seviceID}/plugins`
    await newPlugin(target, body)
  }
}


async function newPlugin(uri: any, data: any) {
  var options = {
    method: 'POST',
    url: uri,
    headers:
    {
      Host: 'localhost:8001',
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: data, json: true
  }
  console.log(data)
  request(options, async function (error: string | undefined, response: any, body: any) {
    if (error)
      throw new Error(error);
    var routeID= await body.id
    console.log("Pulgin Created");
    console.log("Plugin Name",body.name);

  });
}

async function ceratePluginQuotaAtRouteLevel(data:any , routeID:any){
  var rateLimit = parseInt(data) * 1000
  var quotas = await new Quotas({ "service": { "id": routeID }, config: { "minute": rateLimit } })
  var target = `http://localhost:8001/routes/${routeID}/plugins`
  await newPlugin(target, quotas)
}
