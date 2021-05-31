import { WebSocketClient } from "./wsClient";
import { DataHolder } from "../DataHolder";

export abstract class WSRequestType{

    abstract message(ws: WebSocketClient, req: Express.Request, data: any);

    broadcastMessage(data: any){
        DataHolder.getData("wsClients").forEach((elm: WebSocketClient) => {
            elm.dataSend(data);
         });
    }
    
};