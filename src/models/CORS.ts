export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let corsSchema = new Schema({
    "name":{
        type:String,
        default:"cors"
    },
    "service":
        {"id":{
            type:String,
        }
    },
    "config":{
        "origins":{
               type:Array,
               default:['*']
        },
        "methods":{
                type:Array,
                default:['GET', 'HEAD', 'PUT', 'PATCH', 'POST']
        },
        "headers":{
            type:Array,
            default:['authorization' ,'Access-Control-Allow-Origin' ,'Content-Type','SOAPAction']
        },
        "credentials":{
            type:Boolean,
            default: false
        }

    },
    _id : false 
});
const corsService =mongoose.model('cors',corsSchema);


module.exports = corsService;