"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("./ws");
const fs = require('fs');
class WSRequest extends ws_1.WebSocketAPI {
    constructor() {
        super(...arguments);
        this.api = {};
    }
    init() {
        this.loadAPIModule();
    }
    loadAPIModule() {
        const dir = this.getAPIDirectory();
        const path = './build/websocket/wsApi/' + dir;
        const apiAdd = (name, api) => {
            this.api[name] = api;
        };
        fs.readdir(path, function (err, files) {
            if (err)
                throw err;
            files.forEach(element => {
                fs.stat(path + "/" + element, (err, stats) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if (!stats.isDirectory()) {
                        let name = element.slice(0, -3);
                        Promise.resolve().then(() => require('./wsApi/' + dir + '/' + name)).then((module) => {
                            const api = new module[name]();
                            apiAdd(name, api);
                            console.log("[WSAPI_REQ_" + dir + "] " + name + " is loaded. ");
                        }).catch((e) => {
                            console.log(e);
                        });
                    }
                });
            });
        });
    }
    message(ws, req, msg) {
        try {
            const data = JSON.parse(msg);
            // console.log(data);
            if (data.type == null) {
                ws.send(JSON.stringify({
                    type: "error",
                    reason: "データ[type]が不正です。"
                }));
                return;
            }
            if (this.api[data.type] == null) {
                ws.send(JSON.stringify({
                    type: "error",
                    reason: "データ[type]が不正です。"
                }));
                return;
            }
            else {
                this.api[data.type].message(ws, req, data);
            }
        }
        catch (e) {
            ws.send(JSON.stringify({
                type: "error",
                reason: "データの形式が正しくありません"
            }));
            console.log(e);
        }
    }
    ;
}
exports.WSRequest = WSRequest;
;
