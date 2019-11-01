export { };
const readYaml = require('read-yaml');
const newPlugin = require('./index');
const QuotaS =require('./models/mapper')

async function readApiYaml() {
    try {
      readYaml('swagger.yaml', async function (err: any, data: any) {
        if (err)
          console.log("APi.YAML flie is not avilable")
        else {
          var apiYaml = await data
          return apiYaml
        }
      })
    }
    catch (Error) {
      console.log("Error While reading the swagger file")
    }
}
function addPlugins(data:any ,serviceID:any){
    (data.apiLevelPolicy != 'Unlimited')?createPluginQuotaAtApiLevel(data.apiLevelPolicy,serviceID):console.log("Unlimited Trotaling")
}

async function createPluginQuotaAtApiLevel(data: any ,serviceID:any) {
    var rateLimit = parseInt(data.apiLevelPolicy) * 1000
    var quotas = await new QuotaS({ "service": { "id": serviceID }, config: { "minute": rateLimit } })
    var target = `http://localhost:8001/services/${serviceID}/plugins`
    await newPlugin(target, quotas)
}

module.exports={readApiYaml,addPlugins}
