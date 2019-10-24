#!/usr/bin/env node
const request = require('request');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer')
var swagger: any ,api, url: any ,host: String,ans ,seviceID:any; 
var konguri = "http://localhost:8001/services/"
var readYaml = require('read-yaml');
const map= require('./models/mapper');
main()
console.log(map)
async function main() {
  printData()
  await getinput()
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
  }
}

async function rel() {
  try {
    readYaml('swagger.yaml', async function (err: any, data: any) {
      if (err)
        console.log("Unable To Read the Swagger File")
      else {
        swagger = data
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
    var methrdList=[]
    console.log("route is:",route)
    //console.log("routeDatais",data[route])
    for(var methord in data[route]){
      //console.log("Methods are:",methord)
      var string = new String(methord)
      methrdList.push(string.toLocaleUpperCase())
    }
  console.log("Methord list",methrdList)
  result = createPaths(url, swagger.info.title, route, methrdList)
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
          seviceID= await data.id
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

function createPaths(uri:any, host:any , pathName:any , methordList:any){
  var options = { method: 'POST',
  url: uri,
  headers: 
   {
    'Content-Type': 'application/json' 
  },
  body: { paths :[pathName] , methods : methordList , strip_path:false },
  json: true };

request(options, function (error: any, response: any, body: any) {
  if (error) 
    throw new Error(error);
  console.log(body);
});

}

function  addPlugins(uri:any ,servicename:any){
  
}