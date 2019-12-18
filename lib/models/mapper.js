"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuotaServiceSchema = new Schema({
    "name": {
        type: String,
        default: "rate-limiting"
    },
    "service": { "id": {
            type: String,
        }
    },
    "config": { "minute": {
            type: Number
        }
    },
    _id: false
});
var QuotaService = mongoose.model('quotaservice', QuotaServiceSchema);
module.exports = QuotaService;
