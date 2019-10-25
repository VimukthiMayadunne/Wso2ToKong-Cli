"use strict";
var data = {
    quota: {
        ratelimiting: {
            name: 'rate-limiting',
            rate: 'config.minnute',
            applyTo: 'service.id'
        }
    }
};
module.exports = data;
