"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsReqType_1 = require("../../wsReqType");
const DataHolder_1 = require("../../../DataHolder");
class add extends wsReqType_1.WSRequestType {
    message(ws, req, data) {
        let d = DataHolder_1.DataHolder.getData(data.target);
        if (d == null)
            d = [];
        d.push(data.text);
        DataHolder_1.DataHolder.setData(data.target, d);
        this.broadcastMessage({
            type: "add",
            target: data.target,
            text: data.text
        });
    }
}
exports.add = add;
;
