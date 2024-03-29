"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OauthSchema = new Schema({
    "name": {
        type: String,
        default: "oauth2"
    },
    "service": { "id": {
            type: String,
        }
    },
    "config": { "scopes": {
            type: Array,
            default: ["ALL", "all"]
        },
        "token_expiration": {
            type: Number,
            default: 0
        },
        "auth_header_name": {
            type: String,
            default: "authorization"
        },
        "enable_password_grant": {
            type: Boolean,
            default: false,
        },
        "enable_authorization_code": {
            type: Boolean,
            default: false,
        },
        "enable_client_credentials": {
            type: Boolean,
            default: false,
        },
        "enable_implicit_grant": {
            type: Boolean,
            default: false,
        }
    },
    _id: false
});
var Oauth = mongoose.model('oauth', OauthSchema);
module.exports = Oauth;
