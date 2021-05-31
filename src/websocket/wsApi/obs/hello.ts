import { WSRequestType } from "../../wsReqType";
import { WebSocketClient } from "../../wsClient";
import { DataHolder } from "../../../DataHolder";

export class hello extends WSRequestType{
    message(ws: WebSocketClient, req: Express.Request, data: any) {
        let d = DataHolder.getData(data.target);
        ws.dataSend({
            type: "hello",
            data: d
        });
    }
};