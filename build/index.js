"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHolder_1 = require("./DataHolder");
const node_fetch_1 = require("node-fetch");
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const config = require('config');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || config.serverPort || 3000;
const wsPort = process.env.PORT || config.websocketPort || 3000;
const package_json = require('../package.json');
const isProxy = Boolean(process.env.IS_PROXY) || config.isPorxy || false;
app.set('trust proxy', isProxy);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist'));
if (package_json.name == "template") {
    process.exit(1);
}
console.log("///////////////////////////////////////////////");
console.log("     " + package_json.name + " v" + package_json.version);
console.log("///////////////////////////////////////////////");
const router = express.Router();
const init = () => {
    let d = DataHolder_1.DataHolder.getData("wsClients");
    if (d == null)
        d = 8;
    DataHolder_1.DataHolder.setData("wsClients", []);
    d = DataHolder_1.DataHolder.getData("slide");
    if (d == null) {
        d = ["[ここに情報を表示]"];
        node_fetch_1.default('http://weather.livedoor.com/forecast/webservice/json/v1?city=120010')
            .then(res => res.json())
            .then(json => {
            // console.log(json);
            d = [];
            d.push("天気予報 by 日本気象協会(API: livedoor 天気情報)");
            json["forecasts"].forEach((v) => {
                let s = v["date"].replace(/-/g, '/') + " (" + v["dateLabel"] + ") " + v["telop"];
                if (v["temperature"]["min"] != null) {
                    s = s + " 最低気温: " + v["temperature"]["min"]["celsius"] + "℃ (" + v["temperature"]["min"]["fahrenheit"] + "°F)";
                }
                if (v["temperature"]["max"] != null) {
                    s = s + " 最高気温: " + v["temperature"]["max"]["celsius"] + "℃ (" + v["temperature"]["max"]["fahrenheit"] + "°F)";
                }
                d.push(s);
            });
            d.push(json["description"]["text"]);
            DataHolder_1.DataHolder.setData("slide", d);
        })
            .catch(e => {
            DataHolder_1.DataHolder.setData("slide", d);
        });
    }
    ;
    d = DataHolder_1.DataHolder.getData("slide-label");
    if (d == null)
        d = ["天気予報"];
    DataHolder_1.DataHolder.setData("slide-label", d);
    d = DataHolder_1.DataHolder.getData("slide-left");
    if (d == null)
        d = ["配信中"];
    DataHolder_1.DataHolder.setData("slide-left", d);
};
init();
console.log("Loading webAPI module....");
fs.readdir('./build/api', function (err, files) {
    if (err)
        throw err;
    files.forEach(element => {
        let name = element.slice(0, -3);
        Promise.resolve().then(() => require('./api/' + name)).then((module) => {
            const api = new module[name]();
            console.log("[WEBAPI] " + name + " is loaded. endpoint: /api/v1/" + name);
            let endpoint = "/api/v1/" + name;
            if (api.type == "post") {
                router.post(endpoint, (req, res) => {
                    return api.response(req, res);
                });
            }
            else {
                router.get(endpoint, (req, res) => {
                    return api.response(req, res);
                });
            }
        }).catch((e) => {
            console.log("[" + name + "] " + e);
        });
        ;
    });
});
app.use(router);
console.log("Loading websocket module....");
const wsApi = {};
fs.readdir('./build/websocket/wsApi', function (err, files) {
    if (err)
        throw err;
    files.forEach(element => {
        fs.stat('./build/websocket/wsApi/' + element, (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!stats.isDirectory()) {
                let name = element.slice(0, -3);
                Promise.resolve().then(() => require('./websocket/wsApi/' + name)).then((module) => {
                    const api = new module[name]();
                    wsApi[name] = api;
                    api.init();
                    app.ws('/' + name, (ws, req) => {
                        api.connect(ws, req);
                    });
                    console.log("[WSAPI] " + name + " is loaded. ");
                }).catch((e) => {
                    console.log(e);
                });
            }
        });
    });
});
setInterval(() => {
    Object.keys(wsApi).forEach(key => {
        wsApi[key].keepAlive();
    });
}, 25 * 1000);
app.listen(port, function () {
    console.log("listening to PORT: " + port);
});
