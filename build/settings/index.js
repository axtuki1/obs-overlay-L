$(function () {
    let ws;
    setTimeout(() => {
        let domain = "";
        fetch("./api/v1/getWebSocketURL").then(res => res.json()).then((data) => {
            // console.log(data);
            domain = data.url;
            // console.log(domain);
            let url = "ws://" + domain;
            if (location.protocol == 'https:') {
                url = "wss://" + domain;
            }
            // console.log(location.protocol, location.protocol == 'https:');
            ws = new WebSocket(url);
            ws.addEventListener("message", e => {
                const data = JSON.parse(e.data);
                if (data.type == "add") {
                    $(".list ." + data.target).append($("<div></div>").html(data.text));
                }
                else if (data.type == "reset" || data.type == "set") {
                    $(".list ." + data.target).html("").append($("<div></div>").html(data.text));
                }
                else if (data.type == "hello") {
                    data.data.forEach(element => {
                        $(".list ." + data.target).append($("<div></div>").html(element));
                    });
                }
            });
            ws.addEventListener("open", e => {
                ws.send(JSON.stringify({
                    type: "hello",
                    target: "slide"
                }));
                ws.send(JSON.stringify({
                    type: "hello",
                    target: "slide-label"
                }));
                ws.send(JSON.stringify({
                    type: "hello",
                    target: "slide-left"
                }));
            });
            ws.addEventListener("close", e => {
                Library.dialog("通信が切断されました。");
            });
        }).catch((e) => {
            console.log(e);
            Library.dialog("通信に失敗しました。");
        });
    }, 250);
    $(".slide-send-btn").on({ "click": () => {
            ws.send(JSON.stringify({
                type: "add",
                target: "slide",
                text: $(".text.slide").val()
            }));
        } });
    $(".slide-reset-btn").on({ "click": () => {
            ws.send(JSON.stringify({
                type: "reset",
                target: "slide",
                text: $(".text.slide").val()
            }));
        } });
    $(".slide-label-send-btn").on({ "click": () => {
            ws.send(JSON.stringify({
                type: "set",
                target: "slide-label",
                text: $(".text.slide-label").val()
            }));
        } });
    $(".slide-left-send-btn").on({ "click": () => {
            ws.send(JSON.stringify({
                type: "set",
                target: "slide-left",
                text: $(".text.slide-left").val()
            }));
        } });
});
