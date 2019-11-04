export {};
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let CacheSchema = new Schema({
    "name":{
        type:String,
        default:"proxy-cache"
    },
    "service":{
        "id":{
            type:String,
        }
    },
    "config": {
    "cache_ttl":{
        type:Number,
        default:300
    },
    "strategy":{
        type:String,
        default:"memory"
    }
    },
    _id : false 
});

const Cache =mongoose.model('cache',CacheSchema);
module.exports = Cache