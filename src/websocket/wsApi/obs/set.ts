import { WSRequestType } from "../../wsReqType";
import { WebSocketClient } from "../../wsClient";
import { DataHolder } from "../../../DataHolder";

export class set extends WSRequestType {
    message(ws: WebSocketClient, req: Express.Request, data: any) {
        let d = DataHolder.getData(data.target);
        if (d == null) d = [];
        d = [data.text];
        DataHolder.setData(data.target, d);
        this.broadcastMessage({
            type: "set",
            target: data.target,
            text: data.text
        });
    }
};