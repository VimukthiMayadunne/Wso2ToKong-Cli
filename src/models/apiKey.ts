export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let ApiKeySchema = new Schema({
    "name":{
        type:String,
        default:"key-auth"
    },
    "service":{
        "id":{
            type:String,
        }
    },
    "config": {
    "key_names":{
        type:Array,
        default:["apikey"]
    }
    },
    _id : false 
});

const ApiKey =mongoose.model('apikey',ApiKeySchema);
module.exports = ApiKey