import { WSRequestType } from "../../wsReqType";
import { WebSocketClient } from "../../wsClient";
import { DataHolder } from "../../../DataHolder";

export class reset extends WSRequestType {
    message(ws: WebSocketClient, req: Express.Request, data: any) {
        let d = DataHolder.getData(data.target);
        d = [];
        d.push(data.text);
        DataHolder.setData(data.target, d);
        this.broadcastMessage({
            type: "set",
            target: data.target,
            text: data.text
        });
    }
};