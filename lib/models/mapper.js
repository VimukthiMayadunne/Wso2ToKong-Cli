"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuotaRouteSchema = new Schema({
    "name": {
        type: String,
        default: "rate-limiting"
    },
    "route": { "id": {
            type: String,
        }
    },
    "config": { "minute": {
            type: Number
        }
    },
    _id: false
});
var QuotaRoute = mongoose.model('quotaRoute', QuotaRouteSchema);
module.exports = QuotaRoute;
