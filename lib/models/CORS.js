"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var corsSchema = new Schema({
    "name": {
        type: String,
        default: "cors"
    },
    "service": { "id": {
            type: String,
        }
    },
    "config": {
        "origins": {
            type: Array,
            default: ['*']
        },
        "methods": {
            type: Array,
            default: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST']
        },
        "headers": {
            type: Array,
            default: ['authorization', 'Access-Control-Allow-Origin', 'Content-Type', 'SOAPAction']
        },
        "credentials": {
            type: Boolean,
            default: false
        }
    },
    _id: false
});
var corsService = mongoose.model('cors', corsSchema);
module.exports = corsService;
