const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let OauthRouteSchema = new Schema({
    "name":{
        type:String,
        default:"oauth2"
    },
    "service":
        {"id":{
            type:String,
        }
    },
    "config":
        {"scopes":{
               type:Array,
               default:["ALL","all"]
    },
    "token_expiration":{
        type:Number,
        default:0
    },
    "auth_header_name":{
        type:String,
        default:"authorization"
    },
    "enable_password_grant":{
        type:Boolean,
        default:true
    }
    },
    _id : false 
});

const OauthRoute =mongoose.model('oauthRoute',OauthRouteSchema);
module.exports = OauthRoute