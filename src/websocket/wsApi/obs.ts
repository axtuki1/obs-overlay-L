import { DataHolder } from "../../DataHolder";
import { WSRequest } from "../wsReq";

export class obs extends WSRequest {
    getAPIDirectory() {
        return "obs";
    }
}