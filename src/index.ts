#!/usr/bin/env node
export { };
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

const Oauth2 = require('./models/oauth')
const QuotaR = require('./models/rateRoute')
const ApiKey = require('./models/apiKey')
const readFile =require('./apiYaml')
main()

async function main() {
  printData()
  await getinput()
}

//Printing the basic information
function printData() {
  try {
    clear()
   //console.log("APIkeyis:",readFile.readApiYaml())
    console.log(
      chalk.red(
        figlet.textSync('Wso2', { horizontalLayout: 'full' })
      )
    )
    //readFile.addPlugins()
    
  }
  catch (e) {
    console.log("Something went wrong",e);
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

//Reding the yaml file and tehn creating the service in Kong
async function rel() {
  try {
    readYaml('swagger.yaml', async function (err: any, data: any) {
      if (err)
        console.log("Unable To Read the Swagger File")
      else {
        swagger = await data
        try {
          host = swagger.schemes["0"] + "://" + swagger.host + swagger.basePath + "/"
          url = konguri + data.info.title + "/routes"
          var tags = (data.tags != null) ? await addtags(data.tags) : []
          createService(data.info.title, host, tags)
        }
        catch (error) {
          console.log("Please make sure the Swagger filr contains the following fileds")
          console.log("1.Schemse 2.Host 3.BasePath")
        }
      }
    })
  }
  catch (Error) {
    console.log("Error While reading the swagger file")
  }
}
async function addtags(data: any) {
  try {
    var tags = []
    for (var tag in data)
      tags.push(data[tag].name)
    return tags
  }
  catch (e) {
    console.log("No tags in the Swagger File")
    return null
  }
}

async function createService(name: any, host: any, tags: any) {

  var options = {
    method: 'POST',
    url: konguri,
    headers:
    {
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
    request(options, async function (error: any, response: any, body: any) {
      if (error)
        console.log("Unable To Send the Request to create the Service")
      else {
        var data = await body
        if (data.id == null) {
          var apiYaml = await readFile.readApiYaml()
          //console.log("is",apiYaml)
          await readFile.addPlugins(apiYaml,'9ce0e7d7-1bbd-4f48-b3fd-cc84d0a2b38a')
          console.log("Service Name Alredy Exits")
         
        }
        else {
          seviceID = await data.id
          await addSecurity(swagger.securityDefinitions, seviceID)
          //await addPlugins()
          console.log("Service Created")
          console.log("Service ID   :", data.id)
          console.log("Service Name :", data.name)
          createRoute(url, swagger.info.title)     
          //createPluginOauth(seviceID)
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
      console.log("Host Created")
      console.log("Host ID   :", data.id)
      console.log("Host Name :", data.hosts["0"])
      getpaths(swagger.paths)
    }
  });
}

// loop thrugh swageer file and identifin ng routes and mothords associate to the route
async function getpaths(data: any) {
  for (var route in data) {
    var methrdList = []
    //console.log("route is:", route)
    for (var methord in data[route]) {
      var string = new String(methord)
      methrdList.push(string.toLocaleUpperCase())
    }
    //console.log("Methord list", methrdList)
    createPaths(url, swagger.info.title, route, methrdList)
  }
}

function createPaths(uri: any, host: any, pathName: any, methordList: any) {
  var name = pathName.replace(/\W/g, '')
  var options = {
    method: 'POST',
    url: uri,
    headers:
    {
      'Content-Type': 'application/json'
    },
    body: { name: name, paths: [pathName], methods: methordList, strip_path: false },
    json: true
  };

  request(options, async function (error: any, response: any, body: any) {
    if (error)
      throw new Error(error);
    var routeID = await body.id
    if (routeID == null) {
      console.log("Route Name Alredy Exits")
      //better roll back the entire transaction if this ocures
    }
    else {
      var meth: String = methordList[0]
      console.log("Route Created")
      console.log("Route   ID :", routeID)
      console.log("Service ID :", body.service.id)
      if (swagger.paths[pathName][meth.toLocaleLowerCase()]["x-throttling-tier"] != null)
        await ceratePluginQuotaAtRouteLevel(swagger.paths[pathName][meth.toLocaleLowerCase()]["x-throttling-tier"], routeID)
    }
  });

}


async function newPlugin(uri: any, data: any) {
  try {
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
    //console.log(data)
    request(options, async function (error: string | undefined, response: any, body: any) {
      if (error)
        throw new Error(error);
      var routeID = await body.id
      console.log("Pulgin Created");
      console.log("Plugin Name", body.name);

    });
  }
  catch (error) {
    console.log("Unable to Create the Plugin")
  }
}

//need to update the above function to add different flows 


async function ceratePluginQuotaAtRouteLevel(data: any, routeID: any) {
  var rateLimit = parseInt(data) * 1000
  var quotaR = await new QuotaR({ "route": { "id": routeID }, config: { "minute": rateLimit } })
  var target = `http://localhost:8001/routes/${routeID}/plugins`
  await newPlugin(target, quotaR)
}

async function addSecurity(data: any, serviceID: any) {
  for (var security in data) {
    if (data[security].type == "oauth2")
      createPluginOauth(serviceID, data[security].flow)
    else if (data[security].type == 'apiKey')
      createPluginApiKey(serviceID, data[security].name)
  }
}

async function createPluginOauth(serviceID: any, flow: any) {
  if (flow == "implicit")
    var body = await new Oauth2({ service: { "id": seviceID }, config: { "enable_implicit_grant": true } })
  else if (flow == 'password')
    var body = await new Oauth2({ service: { "id": seviceID }, config: { "enable_password_grant": true } })
  else if (flow == 'application')
    var body = await new Oauth2({ service: { "id": seviceID }, config: { "enable_client_credentials": true } })
  else
    var body = await new Oauth2({ service: { "id": seviceID }, config: { "enable_authorization_code": true } })
  //console.log("Details are",body)
  var target = `http://localhost:8001/services/${serviceID}/plugins`
  await newPlugin(target, body)

}

async function createPluginApiKey(serviceID: any, name: any) {
  var body = await new ApiKey({ service: { "id": seviceID }, config: { "key_names": [name] } })
  var target = `http://localhost:8001/services/${serviceID}/plugins`
  await newPlugin(target, body)
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

*/