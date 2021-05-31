"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHolder_1 = require("../DataHolder");
class WSRequestType {
    broadcastMessage(data) {
        DataHolder_1.DataHolder.getData("wsClients").forEach((elm) => {
            elm.dataSend(data);
        });
    }
}
exports.WSRequestType = WSRequestType;
;
