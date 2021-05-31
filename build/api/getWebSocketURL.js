"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
const config = require('config');
class getWebSocketURL extends api_1.API {
    constructor() {
        super(...arguments);
        this.type = "get";
        this.response = (req, res) => {
            if (config.useProxy) {
                res.json({
                    url: req.hostname + "/obs"
                });
            }
            else {
                res.json({
                    url: req.hostname + ":" + config.websocketPort + "/obs"
                });
            }
        };
    }
}
exports.getWebSocketURL = getWebSocketURL;
