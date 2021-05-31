import { API } from "../api";
import { DataHolder } from "../DataHolder";
const config = require('config');

export class getWebSocketURL extends API{
    
    public type: string = "get";
    public response = (req, res) => {
        if(config.useProxy){
            res.json({
                url: req.hostname+"/obs"
            });
        } else {
            res.json({
                url: req.hostname+":"+config.websocketPort+"/obs"
            });
        }
    }

}