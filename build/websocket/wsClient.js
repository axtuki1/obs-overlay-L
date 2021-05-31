"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rndstr = require("rndstr");
const config = require('config');
class WebSocketClient {
    constructor(ws, req) {
        this.lastActivity = 0;
        this.ws = ws;
        this.req = req;
        this.sessionID = rndstr({ length: 16 });
    }
    send(msg) {
        this.updateActivity();
        this.ws.send(msg);
    }
    dataSend(obj) {
        this.updateActivity();
        this.send(JSON.stringify(obj));
    }
    getWebSocket() {
        return this.ws;
    }
    getSessionID() {
        return this.sessionID;
    }
    close() {
        this.ws.close();
    }
    keepAlive() {
        if (config.noActionDisconnectSec != -1 && (new Date().getMilliseconds() - this.lastActivity) * 1000 >= config.noActionDisconnectSec) {
            close();
        }
        else {
            this.ws.send(JSON.stringify({
                "type": "ping",
                "text": "keepAlive"
            }));
        }
    }
    updateActivity() {
        this.lastActivity = new Date().getMilliseconds();
    }
}
exports.WebSocketClient = WebSocketClient;
