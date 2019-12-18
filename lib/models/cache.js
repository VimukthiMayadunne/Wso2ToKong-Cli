"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CacheSchema = new Schema({
    "name": {
        type: String,
        default: "proxy-cache"
    },
    "service": {
        "id": {
            type: String,
        }
    },
    "config": {
        "cache_ttl": {
            type: Number,
            default: 300
        },
        "strategy": {
            type: String,
            default: "memory"
        }
    },
    _id: false
});
var Cache = mongoose.model('cache', CacheSchema);
module.exports = Cache;
