/**
RiemkeClock v 2.0
**/
const posy = 30;
const digits = [[1, 1, 1, 0, 1, 1, 1], [0, 0, 1, 0, 0, 1, 0], [1, 0, 1, 1, 1, 0, 1], [1, 0, 1, 1, 0, 1, 1], [0, 1, 1, 1, 0, 1, 0], [1, 1, 0, 1, 0, 1, 1], [1, 1, 0, 1, 1, 1, 1], [1, 0, 1, 0, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 0, 1, 1]];
const digitPositionsX = [5, 8, 45, 95, 135];
var state = { "mcnt": 0, "msg": false, "music": false, mplay: false, "init": 0 };
var clockUpdateTimer;
var circleUpdateTimer;
var dateUpdateTimer;
var chimeTimer;

function circleUpdate() {
    if (!state.msg & !state.music) {
        const d = new Date();
        const s = d.getSeconds();
        const m = s % 10;
        if (s % 60 == 0 | state.init == 0) {
            "compiled";
            g.setColor(0, 0, 0);
            g.fillRect(0, 88 + posy, 87, 155);
        }
        if (m == 0 | state.init == 0) {
            "compiled";
            g.setColor(1, 1, 1);
            var i = 0;
            const tens = Math.floor(s / 10);
            do {
                "compiled";
                g.fillCircle(10 + i * 15, 100 + posy, 5);
                i++;
            } while (i < tens);

        }
    }
}
function dateUpdate() {
    if (state.msg | state.music)
        return;
    const d = new Date();
    var day = d.getDate();
    var mon = d.getMonth() + 1;
    if (day.toString().length == 1) {
        day = "0" + day;
    }
    if (mon.toString().length == 1) {
        mon = "0" + mon;
    }
    g.setColor(0, 0, 0);
    g.fillRect(88, 100 + posy, 176, 155);
    g.setFontAlign(-1, 0);
    g.setFont("Vector", 30);
    g.setColor(1, 1, 1);
    g.drawString(day + "." + mon, 88, 110 + posy);
    Bluetooth.setConsole(true);

}

function writeDigit(digit, position) {
    "compiled";
    const posx = digitPositionsX[position];
    if (digit[0] == 1)
        g.fillRect(posx, 0 + posy, posx + 30, 12 + posy);//o
    if (digit[1] == 1)
        g.fillRect(posx, 0 + posy, posx + 10, 47 + posy);//li o
    if (digit[2] == 1)
        g.fillRect(posx + 20, 0 + posy, posx + 30, 49 + posy);//re o
    if (digit[3] == 1)
        g.fillRect(posx, 37 + posy, posx + 30, 49 + posy);//mitte
    if (digit[4] == 1)
        g.fillRect(posx, 47 + posy, posx + 10, 87 + posy);//li u
    if (digit[5] == 1)
        g.fillRect(posx + 20, 50 + posy, posx + 30, 87 + posy);//re u
    if (digit[6] == 1)
        g.fillRect(posx, 75 + posy, posx + 30, 87 + posy); //u
}

function clockUpdate() {
    if (state.msg | state.music)
        return;
    var m1;
    var m2;
    var h1;
    var h2;
    var d = new Date();
    var m = d.getMinutes();
    var mStr = m.toString();
    if (mStr.length == 1) {
        m1 = 0;
        m2 = m;
    } else {
        m1 = mStr[0];
        m2 = mStr[1];
    }
    m = d.getHours();
    mStr = m.toString();
    if (mStr.length == 1) {
        h1 = 0;
        h2 = m;
    } else {
        h1 = mStr[0];
        h2 = mStr[1];
    }
    g.setColor(0, 0, 0);
    g.fillRect(0, 0 + posy - 7, 176, 87 + posy);
    g.setColor(1, 1, 1);
    writeDigit(digits[m2], 4);
    writeDigit(digits[m1], 3);
    writeDigit(digits[h2], 2);
    writeDigit(digits[h1], 1);
    g.fillRect(82, 25 + posy, 87, 35 + posy);
    g.fillRect(82, 55 + posy, 87, 65 + posy);
    g.flip();
}


function planDraw() {
    if (clockUpdateTimer) {
        clearTimeout(clockUpdateTimer);
        clockUpdateTimer = undefined;
    }
    clockUpdateTimer = setTimeout(function () {
        clockUpdate();
        clearTimeout(clockUpdateTimer);
        clockUpdateTimer = undefined;
        planDraw();
    }, 60000 - (Date.now() % 60000));
}

function planCircle() {
    if (circleUpdateTimer) {
        clearTimeout(circleUpdateTimer);
        circleUpdateTimer = undefined;
        console.log("clear");
    }
    circleUpdateTimer = setTimeout(function () {
        circleUpdate();
        clearTimeout(circleUpdateTimer);
        circleUpdateTimer = undefined;
        planCircle();
    }, 10000 - (Date.now() % 10000));
}

function planChime() {
    if (chimeTimer)
        clearTimeout(chimeTimer);
    chimeTimer = setTimeout(function () {
        chimeTimer = undefined;
        var h = new Date().getHours();
        if (h < 22 && h > 6) {
            Bangle.buzz().then(() => {
                console.log("Buzz done");
                setTimeout(function () {
                    planChime();
                }, 2000);
            });
        } else {
            setTimeout(function () {
                chimeTimer = undefined;
                planChime();
            }, 2000);
        }

    }, 3600500 - Math.floor((Date.now() % 3600000)));
}
function planDate() {
    if (dateUpdateTimer) {
        clearTimeout(dateUpdateTimer);
        dateUpdateTimer = undefined;
    }
    dateUpdateTimer = setTimeout(function () {
        dateUpdate();
        clearTimeout(dateUpdateTimer);
        dateUpdateTimer = undefined;
        planDate();
    }, 86400000 - (Date.now() % 86400000));
}
Bangle.on('swipe', function (direction) {
    if (state.music == false & direction == 1) {
        Bangle.showLauncher()
    }
    if (state.music == true & direction == 1) {
        "compiled";
        state.music = false;
        g.setColor(0, 0, 0);
        g.fillRect(0, posy, 176, 176);
        g.flip();
        clockUpdate();
        circleUpdate();
        dateUpdate();
        drawLeftBox();
        drawRightBox();
        g.flip();
    }
    if (state.music == false & direction == -1) {
        "compiled";
        g.setColor(0, 0, 0);
        g.fillRect(0, posy, 176, 176);
        g.setFontAlign(-1, 0, 0);
        g.setFont("Vector", 20);
        g.setColor(1, 1, 1);
        g.drawString("Music", 5, 45);
        g.fillRect(70, 70, 100, 100);
        g.drawPoly([130, 70, 160, 85, 130, 100, 130, 70], true);
        g.drawPoly([40, 70, 10, 85, 40, 100, 40, 70], true);
        state.music = true;
    }
});


Bangle.on('touch', function (zone, e) {
    if (state.music) {
        if (e.y > 60 & e.y < 110 & e.x < 60) {
            console.log("prev");
            Bluetooth.println(JSON.stringify({ t: "music", n: "previous" }));
        }
        if (e.y > 60 & e.y < 110 & e.x > 120) {
            console.log("nxt");
            Bluetooth.println(JSON.stringify({ t: "music", n: "next" }));
        }
    }
    if (e.y > 60 & e.y < 110 & e.x > 60 & e.x < 110) {
        if (state.mplay) {
            Bluetooth.println(JSON.stringify({ t: "music", n: "pause" }));
            state.mplay = false;
            g.setColor(1, 0, 0);
            g.fillRect(70, 70, 100, 100);
            g.flip();

        } else {
            Bluetooth.println(JSON.stringify({ t: "music", n: "play" }));
            state.mplay = true;
            g.setColor(0, 1, 0);
            g.fillRect(70, 70, 100, 100);
            g.flip();
        }

    }
    if (state.msg) {
        if (e.y > 130) {
            "compiled";
            state.msg = false;
            state.mcnt = 0;
            g.setColor(0, 0, 0);
            g.fillRect(0, 118, 176, 176);
            drawLeftBox();
            drawRightBox();
            circleUpdate();
            dateUpdate();
            g.flip();
        }
    } else {
        if (e.y > 155) {
            if (e.x > 85) {
                const s = require('Storage');
                settings = s.readJSON('setting.json', 1);
                if (settings.ble == true) {
                    settings.ble = false;
                    g.setColor(0, 1, 0);
                    g.fillRect(90, 155, 176, 176);
                    NRF.sleep();
                } else {
                    settings.ble = true;
                    NRF.sleep();
                    NRF.wake();
                    g.setColor(0, 0, 1);
                    g.fillRect(90, 155, 176, 176);
                }
                s.write('setting.json', settings);
            } else {
                load("launch.app.js");
            }
        }
    }
});
NRF.on("connect", () => setTimeout(sendBatStatus, 5000));
setInterval(sendBatStatus, 1200000);
function sendBatStatus(e) {
    Bluetooth.println("");
    Bluetooth.println(JSON.stringify({ t: "status", bat: E.getBattery() }));
}


function drawLeftBox() {
    "compiled";
    g.setColor(1, 0, 0);
    g.fillRect(0, 155, 80, 176);
}
function drawRightBox() {
    "compiled";
    const s = require('Storage');
    let settings = s.readJSON('setting.json', 1);
    if (settings.ble == true) {
        g.setColor(0, 0, 1);
        g.fillRect(90, 155, 176, 176);
    } else {
        g.setColor(0, 1, 0);
        g.fillRect(90, 155, 176, 176);
    }
}


var _GB = global.GB;
global.GB = (e) => {
    "compiled";
    let a, b;
    if (e.t == "musicinfo" & state.music == true) {
        g.setColor(0, 0, 0);
        g.fillRect(0, 120, 178, 178)
        g.setColor(1, 1, 1);
        g.setFontAlign(-1, 0, 0);
        g.setFont("Vector", 20);
        g.drawString(e.track, 5, 135);
        g.setFontAlign(-1, 0, 0);
        g.drawString(e.artist, 5, 155);
        g.flip();
    } else {
        if (e.t == "call" | e.src == "Business Calendar" | e.src == "Threema" | e.src == "Aqua Mail" | e.src == "Telefon") {
            state.msg = true;
            state.mcnt = state.mcnt + 1;
            if (e.t == "call") {
                a = "Anruf";
                b = e.number;
            } else {
                a = e.title;
                b = e.body;
            }
            g.setColor(1, 1, 1);
            g.fillRect(0, 123, 176, 176);
            g.setFontAlign(-1, 0, 0);
            g.setFont("Vector", 20);
            g.setColor(0, 0, 0);
            g.drawString(a, 30, 135);
            g.setFont("Vector", 20);
            g.setColor(0, 0, 0);
            g.setFontAlign(-1, 0, 0);
            g.drawString(b, 30, 155);
            g.setColor(1, 0, 0);
            g.fillRect(0, 123, 25, 176);
            g.setColor(1, 1, 1);
            g.setFont("Vector", 30);
            g.drawString(state.mcnt, 5, 148);
            Bangle.buzz();
            g.flip();

        }
    }
};

Bluetooth.setConsole(true);
Bangle.setUI("clock");
state.msg = false;
g.setColor(0, 0, 0);
g.fillRect(0, posy, 176, 176);
clockUpdate();
circleUpdate();
dateUpdate();
g.flip();
drawLeftBox();
drawRightBox();
g.flip();
state.init = 1;
planDraw();
planCircle();
planDate();
planChime();
Bluetooth.setConsole(true);
Bangle.loadWidgets();
Bangle.drawWidgets();
