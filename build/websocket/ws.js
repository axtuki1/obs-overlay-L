"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHolder_1 = require("../DataHolder");
const wsClient_1 = require("./wsClient");
class WebSocketAPI {
    constructor() {
        this.clients = DataHolder_1.DataHolder.getData("wsClients");
    }
    init() { }
    connect(ws, req) {
        const wsClient = new wsClient_1.WebSocketClient(ws, req);
        this.clients.push(wsClient);
        DataHolder_1.DataHolder.setData("wsClients", this.clients);
        // console.log("conneted");
        ws.on('close', () => {
            const name = this.clients.find(a => a.getSessionID() === wsClient.getSessionID()).getSessionID();
            this.clients = this.clients.filter(a => a !== wsClient);
            DataHolder_1.DataHolder.setData("wsClients", this.clients);
        });
        // console.log("c");
        ws.on('message', (msg) => {
            // console.log("msg");
            wsClient.updateActivity();
            this.message(wsClient, req, msg);
        });
        this.connectFunc(wsClient, req);
    }
    keepAlive() {
        this.clients.forEach(client => {
            client.keepAlive();
        });
    }
    connectFunc(ws, req) { }
}
exports.WebSocketAPI = WebSocketAPI;
;
