#!/usr/bin/env node
const request = require('request');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer')
var swagger: any ,api, url: any ,host: String,ans; 
var konguri = "http://localhost:8001/services/"
var readYaml = require('read-yaml');

main()

async function main() {
  printData()
  await getinput()
}

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
        getpaths(data.paths)
        createService(data.info.title, host)
      }
    })
  }
  catch (Error) {
    console.log("Error While reading the swagger file")
  }
}

function getpaths(data: any) {
  for (let route of data) {
    console.log(route.name)
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
          console.log("Service Created", data)
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
      //console.log(body);
    }
  });
}


