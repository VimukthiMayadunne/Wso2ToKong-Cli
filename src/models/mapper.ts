const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let QuotaSchema = new Schema({
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
            type:String
    }
    },
    _id : false 
});

const Quota =mongoose.model('quota',QuotaSchema);
module.exports = Quota;