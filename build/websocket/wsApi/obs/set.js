"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsReqType_1 = require("../../wsReqType");
const DataHolder_1 = require("../../../DataHolder");
class set extends wsReqType_1.WSRequestType {
    message(ws, req, data) {
        let d = DataHolder_1.DataHolder.getData(data.target);
        if (d == null)
            d = [];
        d = [data.text];
        DataHolder_1.DataHolder.setData(data.target, d);
        this.broadcastMessage({
            type: "set",
            target: data.target,
            text: data.text
        });
    }
}
exports.set = set;
;
