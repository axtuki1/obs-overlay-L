"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsReqType_1 = require("../../wsReqType");
const DataHolder_1 = require("../../../DataHolder");
class hello extends wsReqType_1.WSRequestType {
    message(ws, req, data) {
        let d = DataHolder_1.DataHolder.getData(data.target);
        ws.dataSend({
            type: "hello",
            data: d,
            target: data.target
        });
    }
}
exports.hello = hello;
;
