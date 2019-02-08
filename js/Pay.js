class Pay {
    show() {
        this.text = new GetMusic().http("MusicPlayer/../var/pay/pay.js", (back) => {
            console.info(back);
            new Dialog(back).css({
                background: "#00BCD4"
            });
        });
    }
}