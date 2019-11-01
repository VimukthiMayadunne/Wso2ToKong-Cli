export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let QuotaServiceSchema = new Schema({
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
               type:String,
               default:'*'
        },
        "methods":{
                type:Array,
                default:['GET', 'HEAD', 'PUT', 'PATCH', 'POST']
        },
        "headers":{
            type:Array,
            default:['authorization' ,'Access-Control-Allow-Origin' ,'Content-Type','SOAPAction']
        }

    },
    _id : false 
});
const QuotaService =mongoose.model('quotaservice',QuotaServiceSchema);


module.exports = QuotaService;