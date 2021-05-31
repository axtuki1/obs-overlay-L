const rndstr = require("rndstr");
const config = require('config');

export class WebSocketClient {

    lastActivity = 0;
    ws: WebSocket;
    req: Express.Request;
    sessionID: string;

    constructor(ws: WebSocket, req: Express.Request){
        this.ws = ws;
        this.req = req;
        this.sessionID = rndstr({length: 16});
    }

    send( msg: any ): void{
        this.updateActivity();
        this.ws.send(msg);
    }

    dataSend( obj: object ){
        this.updateActivity();
        this.send( JSON.stringify(obj) );
    }

    getWebSocket():WebSocket {
        return this.ws;
    }

    getSessionID(): string{
        return this.sessionID;
    }

    close(): void{
        this.ws.close();
    }
    
    keepAlive(){
        if( config.noActionDisconnectSec != -1 && ( new Date().getMilliseconds() - this.lastActivity) * 1000 >= config.noActionDisconnectSec ){
            close();
        } else {
            this.ws.send(JSON.stringify({
                "type": "ping",
                "text": "keepAlive"
            }));
        }
    }

    updateActivity(): void{
        this.lastActivity = new Date().getMilliseconds();
    }
}