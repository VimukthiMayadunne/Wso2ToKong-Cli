export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let QuotaRouteSchema = new Schema({
    "name":{
        type:String,
        default:"rate-limiting"
    },
    "route":
        {"id":{
            type:String,
        }
    },
    "config":
        {"minute":{
               type:Number
    }
    },
    _id : false 
});
const QuotaRoute =mongoose.model('quotaRoute',QuotaRouteSchema);


module.exports = QuotaRoute;