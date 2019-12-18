export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let QuotaServiceSchema = new Schema({
    "name":{
        type:String,
        default:"rate-limiting"
    },
    "service":
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
const QuotaService =mongoose.model('quotaservice',QuotaServiceSchema);


module.exports = QuotaService;