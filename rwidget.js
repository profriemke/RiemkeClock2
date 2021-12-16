//WIDGETS = {};

(() => {
    let t = "00";
    let mem = ((100 / 12000) * process.memory().usage).toFixed();
    function draw() {
        g.reset();
        g.setFont("Vector", 14);
        g.setFontAlign(-1, 0, 0);
        g.setColor(0, 1, 1);
        g.drawString(t + " | " + mem, this.x + 35, this.y + 13);
        g.setColor(0, 0, 1);
        g.fillRect(this.x + 148, this.y + 7, this.x + 170, this.y + 17);
        g.setColor(0, 1, 1);
        g.fillRect(this.x + 148, this.y + 7, this.x + 149 + (0.2 * E.getBattery()) - 1, this.y + 17);
        g.fillCircle(this.x + 120, this.y + 12, 6);
        if (!NRF.getSecurityStatus().connected) {
            g.setColor(0, 0, 0);
            g.fillCircle(this.x + 120, this.y + 12, 5);
        }
        if (Bangle.isLocked()) {
            g.setColor(1, 0, 0);
            g.fillRect(this.x + 3, this.y + 5, this.x + 15, this.y + 17);
        } else {
            g.setColor(0, 0, 0);
            g.fillRect(this.x + 3, this.y + 5, this.x + 15, this.y + 17);
        }
        g.flip();

        Bangle.getPressure().then(e => {
            "compiled";
            t = e.temperature.toFixed();
            g.reset();
            g.setFont("Vector", 14);
            g.setFontAlign(-1, 0, 0);
            g.setColor(0, 1, 1);
            g.clearRect(this.x + 35, this.y, this.x + 80, this.y + 20);
            g.drawString(t + " | " + mem, this.x + 35, this.y + 13);
            g.flip();
        });
    }
    setInterval(function () {
        WIDGETS["rtemp"].draw(WIDGETS["rtemp"]);
    }, 60000);

    WIDGETS["rtemp"] = {
        area: "tr",
        width: 178,
        draw: draw,
        update: () => { WIDGETS["rtemp"].draw(WIDGETS["rtemp"]); }
    };
    NRF.on('connect', WIDGETS["rtemp"].update);
    NRF.on('disconnect', WIDGETS["rtemp"].update);
    Bangle.on("lock", WIDGETS["rtemp"].update);
})()


//Bangle.drawWidgets();
