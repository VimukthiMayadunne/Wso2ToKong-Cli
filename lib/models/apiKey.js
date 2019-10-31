"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ApiKeySchema = new Schema({
    "name": {
        type: String,
        default: "key-auth"
    },
    "service": {
        "id": {
            type: String,
        }
    },
    "config": {
        "key_names": {
            type: Array,
            default: ["apikey"]
        }
    },
    _id: false
});
var ApiKey = mongoose.model('apikey', ApiKeySchema);
module.exports = ApiKey;
