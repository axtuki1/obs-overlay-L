import { WebSocketAPI } from "./ws";
import { WSRequestType } from "./wsReqType";
import { WebSocketClient } from "./wsClient";

const fs = require('fs');

export abstract class WSRequest extends WebSocketAPI {
    api: { [key: string]: WSRequestType } = {};

    init() {
        this.loadAPIModule();
    }

    loadAPIModule() {
        const dir = this.getAPIDirectory();
        const path = './build/websocket/wsApi/' + dir;
        const apiAdd = (name: string, api: WSRequestType) => {
            this.api[name] = api;
        }
        fs.readdir(path, function (err, files) {
            if (err) throw err;
            files.forEach(element => {
                fs.stat(path + "/" + element, (err, stats) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if (!stats.isDirectory()) {
                        let name: string = element.slice(0, -3);
                        import('./wsApi/' + dir + '/' + name).then((module) => {
                            const api: WSRequestType = new module[name]();
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

    abstract getAPIDirectory();

    message(ws: WebSocketClient, req: Express.Request, msg: string) {
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
            } else {
                this.api[data.type].message(ws, req, data);
            }
        } catch (e) {
            ws.send(JSON.stringify({
                type: "error",
                reason: "データの形式が正しくありません"
            }));
            console.log(e);
        }
    };

};