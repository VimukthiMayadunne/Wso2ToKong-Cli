export { };
const readYaml = require('read-yaml');
const QuotaS = require('./models/mapper');
const CORS = require('./models/CORS');
const request = require('request');
const cache =require('./models/cache')
async function readApiYaml() {
    return new Promise(async function (reslove, reject) {
        try {
            readYaml('api.yaml', async function (err: any, data: any) {
                if (err)
                    console.log("APi.YAML flie is not avilable")
                else {
                    var apiYaml = await data
                    reslove(apiYaml)
                }
            })
        }
        catch (Error) {
            console.log("Error While reading the swagger file", Error);
            return reject(Error)
        }
    })
}
function addPlugins(data: any, serviceID: any) {
    //(data.apiLevelPolicy != 'Unlimited') ? createPluginQuotaAtApiLevel(data.apiLevelPolicy, serviceID) : console.log("Unlimited Trotaling");
    //(data.corsConfiguration.corsConfigurationEnabled) ? createPluginCorss(data.corsConfiguration, serviceID) : console.log("cors is Disabled");
    (data.responseCache == "Enabled") ? createPluginCache(data.cacheTimeout, serviceID) : console.log("Cashe Disabled");
}

async function createPluginQuotaAtApiLevel(data: any, serviceID: any) {
    var rateLimit = parseInt(data) * 1000
    console.log("Rate:",rateLimit)
    var quotas = await new QuotaS({ "service": { "id": serviceID }, config: { "minute": rateLimit } })
    var target = `http://localhost:8001/services/${serviceID}/plugins`
    await newPlugin(target, quotas)
}

async function createPluginCorss(data: any, serviceID: any) {
    var corsD = await new CORS({ "service": { "id": serviceID }, config: { "methods": data.accessControlAllowMethods, headers: data.accessControlAllowHeaders, origins: data.accessControlAllowOrigins, credentials: data.accessControlAllowCredentials } })
    var target = `http://localhost:8001/services/${serviceID}/plugins`
    await newPlugin(target, corsD)
}
//addd stratergy
async function createPluginCache(data: any, serviceID: any) {
    var corsD = await new cache({ "service": { "id": serviceID }, config: { "cache_ttl": data } })
    var target = `http://localhost:8001/services/${serviceID}/plugins`
    await newPlugin(target, corsD)
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
            console.log("Pulgin Created",options.body);
            console.log("Plugin Name", body);

        });
    }
    catch (error) {
        console.log("Unable to Create the Plugin")
    }
}
module.exports = { readApiYaml, addPlugins }
