$(function () {
    let next = [];
    let ws;
    let playing = false;
    $(".info-text").on({
        "animationend": () => {
            play();
        }
    });
    const play = () => {
        if (next.length != 0) {
            const text = next[0];
            next.shift();
            next.push(text);
            $(".info-text").removeClass("slide").removeClass("out").removeClass("show").css("animation-duration", "").html(text);
            if ($(".info").width() < $(".info-text").width()) {
                // anime
                $(".info-text").addClass("show").addClass("slide").css("animation-duration", (text.length * 300) + "ms");
            }
            else {
                $(".info-text").addClass("show");
                setTimeout(() => {
                    $(".info-text").addClass("out");
                }, Math.max(text.length * 600, 4000));
            }
        }
    };
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
                if (data.target == "slide") {
                    if (data.type == "add") {
                        next.splice(0, 0, data.text);
                    }
                    else if (data.type == "reset") {
                        next = [];
                        next.push(data.text);
                    }
                    else if (data.type == "hello") {
                        next = data.data;
                    }
                    if (!playing && next.length != 0) {
                        playing = true;
                        play();
                    }
                }
                else if (data.target == "slide-label") {
                    if (data.type == "set" || data.type == "hello") {
                        $(".label-text").html(data.data || data.text);
                    }
                }
                else if (data.target == "slide-left") {
                    if (data.type == "set" || data.type == "hello") {
                        $(".L-left-text").html(data.data || data.text);
                    }
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
});
