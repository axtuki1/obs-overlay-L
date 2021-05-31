"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsReq_1 = require("../wsReq");
class obs extends wsReq_1.WSRequest {
    getAPIDirectory() {
        return "obs";
    }
}
exports.obs = obs;
